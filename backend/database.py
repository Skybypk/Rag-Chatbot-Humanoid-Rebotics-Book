import asyncpg
import logging
from config import Config
from typing import Optional

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.config = Config()
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        """Create connection pool to Neon database"""
        try:
            self.pool = await asyncpg.create_pool(
                dsn=self.config.DATABASE_URL,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
            logger.info("Connected to Neon database successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Neon database: {e}")
            raise

    async def close(self):
        """Close connection pool"""
        if self.pool:
            await self.pool.close()

    async def save_query_log(self, query: str, response: str, user_id: Optional[str] = None):
        """Save query and response to database for analytics"""
        if not self.pool:
            logger.warning("Database not connected, skipping query log")
            return

        try:
            async with self.pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO query_logs (query, response, user_id, created_at)
                    VALUES ($1, $2, $3, NOW())
                """, query, response, user_id)
        except Exception as e:
            logger.error(f"Failed to save query log: {e}")

    async def get_user_history(self, user_id: str, limit: int = 10):
        """Get user's query history"""
        if not self.pool:
            logger.warning("Database not connected, cannot fetch history")
            return []

        try:
            async with self.pool.acquire() as conn:
                rows = await conn.fetch("""
                    SELECT query, response, created_at
                    FROM query_logs
                    WHERE user_id = $1
                    ORDER BY created_at DESC
                    LIMIT $2
                """, user_id, limit)
                return [dict(row) for row in rows]
        except Exception as e:
            logger.error(f"Failed to fetch user history: {e}")
            return []

    async def init_tables(self):
        """Initialize required tables if they don't exist"""
        if not self.pool:
            logger.warning("Database not connected, cannot initialize tables")
            return

        try:
            async with self.pool.acquire() as conn:
                # Create query logs table
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS query_logs (
                        id SERIAL PRIMARY KEY,
                        query TEXT NOT NULL,
                        response TEXT NOT NULL,
                        user_id VARCHAR(255),
                        created_at TIMESTAMP DEFAULT NOW()
                    )
                """)

                # Create user preferences table for personalization features
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS user_preferences (
                        user_id VARCHAR(255) PRIMARY KEY,
                        language_preference VARCHAR(10) DEFAULT 'en',
                        preferred_format TEXT DEFAULT 'detailed',
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW()
                    )
                """)

                # Create Urdu content table if needed
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS urdu_content (
                        id SERIAL PRIMARY KEY,
                        english_content_id VARCHAR(255),
                        urdu_translation TEXT,
                        created_at TIMESTAMP DEFAULT NOW()
                    )
                """)

            logger.info("Database tables initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database tables: {e}")
            raise