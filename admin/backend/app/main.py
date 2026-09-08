from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.gallery import router as gallery_router
from app.routers.admin import router as admin_router

app = FastAPI(
    title="Portraiture API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "https://karteverything-admin.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gallery_router)
app.include_router(admin_router)

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
    }