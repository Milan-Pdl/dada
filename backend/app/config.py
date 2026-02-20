import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # default to a local file while developing, but serverless filesystems are
    # read-only/ephemeral (Vercel, AWS Lambda, etc.). When running in those
    # environments we automatically fall back to an in-memory SQLite database.
    DATABASE_URL: str = "sqlite:///./neplaunch.db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    OPENAI_API_KEY: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"

    def __init__(self, **values):
        super().__init__(**values)
        # detect typical serverless indicators and adjust the database URL
        if self.DATABASE_URL.startswith("sqlite://"):
            # vercel sets VERCEL=1, lambda sets AWS_LAMBDA_FUNCTION_NAME
            if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
                # use memory DB to avoid "unable to open database file" errors
                self.DATABASE_URL = "sqlite:///:memory:"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
