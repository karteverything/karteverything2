import io
import uuid
import logging

logger = logging.getLogger(__name__)

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from PIL import Image, ImageOps

from app.config import settings
from app.dependencies import require_admin
from app.schemas.gallery import (
    DeleteImagesRequest,
    GalleryImage,
    RenameImageRequest,
)
from app.services.supabase import supabase

router = APIRouter(
    prefix="/api/gallery",
    tags=["Gallery"],
)

BUCKET_NAME = "gallery"
STORAGE_PREFIX = "portraits"
# ---------------------------------------------------------
# HELPERS
# ---------------------------------------------------------
def _get_public_url(storage_path: str) -> str:
    return (
        supabase
        .storage
        .from_(BUCKET_NAME)
        .get_public_url(storage_path)
    )

def _storage_path_from_url(
    image_url: str | None,
) -> str | None:
    """
    Fallback for older gallery records that don't yet have
    a storage_path value.
    Example:
    https://project.supabase.co/storage/v1/object/public/
    gallery/portraits/image.jpg
    becomes:
    portraits/image.jpg
    """
    if not image_url:
        return None

    marker = (
        f"/storage/v1/object/public/"
        f"{BUCKET_NAME}/"
    )
    if marker not in image_url:
        return None

    return image_url.split(
        marker,
        1,
    )[1]

def _validate_and_process_image(
    file_bytes: bytes,
) -> bytes:
    """
    Validate the uploaded file and convert it to a
    clean JPEG.
    This also removes EXIF metadata such as GPS data.
    """
    try:
        image = Image.open(
            io.BytesIO(file_bytes)
        )

        # Force actual decoding.
        image.verify()

        # verify() closes the image, so reopen it.
        image = Image.open(
            io.BytesIO(file_bytes)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image file",
        ) from exc
    try:
        # Respect camera orientation before
        # removing EXIF metadata.
        image = ImageOps.exif_transpose(
            image
        )
        # Handle transparency.
        if image.mode in (
            "RGBA",
            "LA",
            "P",
        ):
            if image.mode == "P":
                image = image.convert(
                    "RGBA"
                )

            background = Image.new(
                "RGB",
                image.size,
                "white",
            )

            if image.mode in (
                "RGBA",
                "LA",
            ):
                background.paste(
                    image,
                    mask=image.getchannel(
                        "A"
                    ),
                )
                image = background
            else:
                image = image.convert(
                    "RGB"
                )
        else:
            image = image.convert(
                "RGB"
            )
        output = io.BytesIO()

        image.save(
            output,
            format="JPEG",
            quality=90,
            optimize=True,
        )
        return output.getvalue()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to process image",
        ) from exc
# ---------------------------------------------------------
# GET ALL
# ---------------------------------------------------------
@router.get(
    "",
    response_model=list[GalleryImage],
)
async def get_gallery():
    """
    Public gallery endpoint.
    """
    response = (
        supabase
        .table("portraits")
        .select(
            "id,title,image_url,created_at"
        )
        .order(
            "created_at",
            desc=True,
        )
        .execute()
    )
    return response.data or []
# ---------------------------------------------------------
# GET ONE
# ---------------------------------------------------------
@router.get(
    "/{image_id}",
    response_model=GalleryImage,
)
async def get_gallery_image(
    image_id: uuid.UUID,
):
    response = (
        supabase
        .table("portraits")
        .select(
            "id,title,image_url,created_at"
        )
        .eq(
            "id",
            str(image_id),
        )
        .maybe_single()
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
    return response.data
# ---------------------------------------------------------
# UPLOAD
# ---------------------------------------------------------
@router.post(
    "",
    response_model=GalleryImage,
    status_code=status.HTTP_201_CREATED,
)
async def upload_image(
    title: str = Form(...),
    file: UploadFile = File(...),
    admin: dict = Depends(require_admin),
):
    title = title.strip()

    if not title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image title is required",
        )

    if len(title) > 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image title is too long",
        )
    
    if (
        not file.content_type
        or not file.content_type.startswith(
            "image/"
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed",
        )
    file_bytes = await file.read()

    max_size = (
        settings.max_upload_size_mb
        * 1024
        * 1024
    )

    if len(file_bytes) > max_size:
        raise HTTPException(
            status_code=(
                status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            ),
            detail=(
                f"Image exceeds the "
                f"{settings.max_upload_size_mb}MB limit"
            ),
        )
    clean_image = (
        _validate_and_process_image(
            file_bytes
        )
    )
    # Generate a completely unique filename.
    file_id = uuid.uuid4()

    storage_path = (
        f"{STORAGE_PREFIX}/"
        f"{file_id}.jpg"
    )
    # -----------------------------------------------------
    # Upload to Supabase Storage
    # -----------------------------------------------------
    try:
        supabase.storage.from_(
            BUCKET_NAME
        ).upload(
            storage_path,
            clean_image,
            {
                "content-type": "image/jpeg",
                "cache-control": "31536000",
                "upsert": "false",
            },
        )
    except Exception as exc:
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Failed to upload image",
        ) from exc
    image_url = _get_public_url(
        storage_path
    )
    # -----------------------------------------------------
    # Create database record
    # -----------------------------------------------------
    try:
        response = (
            supabase
            .table("portraits")
            .insert(
                {
                    "title": title,
                    "image_url": image_url,
                    "storage_path": storage_path,
                }
            )
            .execute()
        )
    except Exception as exc:
        # Database insertion failed, so remove the
        # Storage object we just uploaded.
        try:
            supabase.storage.from_(
                BUCKET_NAME
            ).remove(
                [storage_path]
            )
        except Exception:
            pass
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Failed to create gallery record",
        ) from exc
    if not response.data:
        # Extra cleanup in the unlikely event that
        # Supabase returns no inserted row.
        try:
            supabase.storage.from_(
                BUCKET_NAME
            ).remove(
                [storage_path]
            )
        except Exception:
            pass
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Image was uploaded but no "
                "database record was returned"
            ),
        )
    return response.data[0]
# ---------------------------------------------------------
# RENAME
# ---------------------------------------------------------
@router.patch(
    "/{image_id}",
    response_model=GalleryImage,
)
async def rename_image(
    image_id: uuid.UUID,
    data: RenameImageRequest,
    admin: dict = Depends(require_admin),
):
    title = data.title.strip()

    if not title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title cannot be empty",
        )

    if len(title) > 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is too long",
        )
    response = (
        supabase
        .table("portraits")
        .update(
            {
                "title": title
            }
        )
        .eq(
            "id",
            str(image_id),
        )
        .execute()
    )
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
    return response.data[0]
# ---------------------------------------------------------
# DELETE ONE
# ---------------------------------------------------------
@router.delete(
    "/{image_id}",
)
async def delete_image(
    image_id: uuid.UUID,
    admin: dict = Depends(require_admin),
):
    response = (
        supabase
        .table("portraits")
        .select(
            "id,image_url,storage_path"
        )
        .eq(
            "id",
            str(image_id),
        )
        .maybe_single()
        .execute()
    )
    image = response.data

    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
    # -----------------------------------------------------
    # Determine Storage path
    # -----------------------------------------------------
    #
    # New records:
    #     storage_path is used directly.
    #
    # Old records:
    #     fall back to extracting it from image_url.
    #
    storage_path = (
        image.get("storage_path")
        or _storage_path_from_url(
            image.get("image_url")
        )
    )
    # -----------------------------------------------------
    # Delete Storage object
    # -----------------------------------------------------
    if storage_path:
        try:
            supabase.storage.from_(
                BUCKET_NAME
            ).remove(
                [storage_path]
            )
        except Exception as exc:
            raise HTTPException(
                status_code=(
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                ),
                detail="Failed to delete image from storage",
            ) from exc
    # -----------------------------------------------------
    # Delete database record
    # -----------------------------------------------------
    delete_response = (
        supabase
        .table("portraits")
        .delete()
        .eq(
            "id",
            str(image_id),
        )
        .execute()
    )
    if not delete_response.data:
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Failed to delete gallery record",
        )
    return {
        "message": "Image deleted",
        "id": str(image_id),
    }
# ---------------------------------------------------------
# DELETE MANY
# ---------------------------------------------------------
@router.delete("")
async def delete_images(
    data: DeleteImagesRequest,
    admin: dict = Depends(require_admin),
):
    if not data.ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image IDs supplied",
        )

    image_ids = [
        str(image_id)
        for image_id in data.ids
    ]
    # -----------------------------------------------------
    # Get records first
    # -----------------------------------------------------
    response = (
        supabase
        .table("portraits")
        .select(
            "id,image_url,storage_path"
        )
        .in_(
            "id",
            image_ids,
        )
        .execute()
    )
    images = response.data or []

    if not images:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No matching images found",
        )
    # -----------------------------------------------------
    # Build Storage paths
    # -----------------------------------------------------
    storage_paths = []

    for image in images:
        storage_path = (
            image.get("storage_path")
            or _storage_path_from_url(
                image.get("image_url")
            )
        )
        if storage_path:
            storage_paths.append(
                storage_path
            )
    # -----------------------------------------------------
    # Delete Storage objects
    # -----------------------------------------------------
    if storage_paths:
        try:
            supabase.storage.from_(
                BUCKET_NAME
            ).remove(
                storage_paths
            )
        except Exception as exc:
            raise HTTPException(
                status_code=(
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                ),
                detail="Failed to delete images from storage",
            ) from exc
    # -----------------------------------------------------
    # Delete database records
    # -----------------------------------------------------
    delete_response = (
        supabase
        .table("portraits")
        .delete()
        .in_(
            "id",
            image_ids,
        )
        .execute()
    )

    if not delete_response.data:
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Failed to delete gallery records",
        )
    return {
        "message": "Images deleted",
        "deleted_ids": [
            str(image_id)
            for image_id in image_ids
        ],
    }