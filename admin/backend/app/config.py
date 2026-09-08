from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    supabase_url: str
    supabase_secret_key: str
    frontend_url: str = "http://localhost:5173"
    admin_user_ids: str = ""
    max_upload_size_mb: int = Field(
        default=15,
        gt=0,
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def admin_ids(self) -> set[str]:
        return {
            user_id.strip()
            for user_id in self.admin_user_ids.split(",")
            if user_id.strip()
        }

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()