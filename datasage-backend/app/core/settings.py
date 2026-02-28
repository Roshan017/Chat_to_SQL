from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "DataSage"
    APP_VERSION: str = "1.0"
    FRONTEND_URL: str = "http://localhost:3000"

    REDIS_ENABLED: bool = False
    REDIS_URL: str | None = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_CACHE_TTL: int = 3600

    

    # Settings passed via API now
    # INTENT_RECOG_PROMPT: str
    # SCHEMA_PRUNING_PROMPT: str

    SOCIAL_PROMPT: str


    GEMINI_API_KEY: str | None = None
    MEMORY_PG_CLOUD: str | None = None

    LANGFUSE_SECRET_KEY: str | None = None
    LANGFUSE_PUBLIC_KEY: str | None = None
    LANGFUSE_BASE_URL: str | None = None

    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()
