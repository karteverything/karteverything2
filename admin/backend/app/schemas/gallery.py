from datetime import datetime
from pydantic import BaseModel, Field
from uuid import UUID

class GalleryImage(BaseModel):
    id: UUID
    title: str
    image_url: str
    created_at: datetime | None = None

class RenameImageRequest(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
    )

class DeleteImagesRequest(BaseModel):
    ids: list[UUID]