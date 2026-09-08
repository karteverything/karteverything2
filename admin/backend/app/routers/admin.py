from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends

from app.dependencies import require_admin
from app.services.supabase import supabase


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


@router.get("/stats")
async def get_admin_stats(
    admin: dict = Depends(require_admin),
):
    now = datetime.now(timezone.utc)

    start_of_today = now.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    start_of_week = start_of_today - timedelta(
        days=start_of_today.weekday()
    )

    start_of_month = start_of_today.replace(
        day=1
    )

    # ---------------------------------------------------------
    # TOTAL IMAGES
    # ---------------------------------------------------------
    total_response = (
        supabase
        .table("portraits")
        .select("id", count="exact")
        .execute()
    )

    total_images = total_response.count or 0

    # ---------------------------------------------------------
    # UPLOADS TODAY
    # ---------------------------------------------------------
    today_response = (
        supabase
        .table("portraits")
        .select("id", count="exact")
        .gte(
            "created_at",
            start_of_today.isoformat(),
        )
        .execute()
    )

    uploads_today = today_response.count or 0

    # ---------------------------------------------------------
    # UPLOADS THIS WEEK
    # ---------------------------------------------------------
    week_response = (
        supabase
        .table("portraits")
        .select("id", count="exact")
        .gte(
            "created_at",
            start_of_week.isoformat(),
        )
        .execute()
    )

    uploads_this_week = week_response.count or 0

    # ---------------------------------------------------------
    # UPLOADS THIS MONTH
    # ---------------------------------------------------------
    month_response = (
        supabase
        .table("portraits")
        .select("id", count="exact")
        .gte(
            "created_at",
            start_of_month.isoformat(),
        )
        .execute()
    )

    uploads_this_month = month_response.count or 0

    # ---------------------------------------------------------
    # LATEST UPLOAD
    # ---------------------------------------------------------
    latest_response = (
        supabase
        .table("portraits")
        .select(
            "id,title,image_url,created_at"
        )
        .order(
            "created_at",
            desc=True,
        )
        .limit(1)
        .execute()
    )

    latest_upload = None

    if latest_response.data:
        latest_upload = latest_response.data[0]

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------
    return {
        "total_images": total_images,
        "uploads_today": uploads_today,
        "uploads_this_week": uploads_this_week,
        "uploads_this_month": uploads_this_month,
        "latest_upload": latest_upload,
    }