from typing import List
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass
class Config:
    # Qdrant configuration
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    COLLECTION_NAME: str = os.getenv("COLLECTION_NAME", "humanoid_robotics_book")

    # Neon PostgreSQL configuration
    DATABASE_URL: str = os.getenv("NEON_DATABASE_URL",
        f"postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require")

    # Model configuration
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "microsoft/DialoGPT-medium")  # Placeholder

    # Application settings
    MAX_CONTEXT_LENGTH: int = int(os.getenv("MAX_CONTEXT_LENGTH", "5"))
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.7"))

    # Book content paths
    BOOK_DOCS_PATH: str = os.getenv("BOOK_DOCS_PATH",
        "../../docs/")