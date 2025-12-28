from typing import List, Dict, Any
import logging
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http import models
from config import Config
import asyncio
import os
import re

# Import database manager
from database import DatabaseManager
from urdu_translation import UrduTranslationService

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.config = Config()
        self.qdrant_client = QdrantClient(
            host=self.config.QDRANT_HOST,
            port=self.config.QDRANT_PORT,
            api_key=self.config.QDRANT_API_KEY
        )
        self.embedding_model = SentenceTransformer(self.config.EMBEDDING_MODEL)
        self.collection_name = self.config.COLLECTION_NAME

        # Initialize database manager
        self.db_manager = DatabaseManager()

        # Initialize Urdu translation service
        self.urdu_service = UrduTranslationService()

        # Initialize the collection if it doesn't exist
        self._init_collection()

    async def initialize_db(self):
        """Initialize database connection and tables"""
        await self.db_manager.connect()
        await self.db_manager.init_tables()

    def _init_collection(self):
        """Initialize Qdrant collection for book content"""
        try:
            # Check if collection exists
            self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection {self.collection_name} already exists")
        except:
            # Create collection if it doesn't exist
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=384,  # Size of all-MiniLM-L6-v2 embeddings
                    distance=models.Distance.COSINE
                )
            )
            logger.info(f"Created collection {self.collection_name}")

            # Load book content and add to collection
            self.load_book_content()

    def load_book_content(self):
        """Load book content from docs directory and add to vector store"""
        docs_path = self.config.BOOK_DOCS_PATH
        points = []
        point_id = 0

        # Read all markdown files from docs directory
        for filename in os.listdir(docs_path):
            if filename.endswith('.md'):
                with open(os.path.join(docs_path, filename), 'r', encoding='utf-8') as f:
                    content = f.read()

                    # Split content into chunks (simple approach)
                    chunks = self._split_content(content)

                    for i, chunk in enumerate(chunks):
                        # Create embedding for the chunk
                        embedding = self.embedding_model.encode(chunk).tolist()

                        # Create a point for Qdrant
                        point = models.PointStruct(
                            id=point_id,
                            vector=embedding,
                            payload={
                                "content": chunk,
                                "source": filename,
                                "chunk_id": i
                            }
                        )
                        points.append(point)
                        point_id += 1

        # Upload points to Qdrant
        if points:
            self.qdrant_client.upload_points(
                collection_name=self.collection_name,
                points=points
            )
            logger.info(f"Uploaded {len(points)} points to Qdrant collection {self.collection_name}")

    def _split_content(self, content: str, max_length: int = 500) -> List[str]:
        """Split content into chunks of specified length"""
        # Remove frontmatter if present
        content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)

        # Split into sentences first
        sentences = re.split(r'[.!?]+', content)

        chunks = []
        current_chunk = ""

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue

            if len(current_chunk) + len(sentence) < max_length:
                current_chunk += " " + sentence
            else:
                if current_chunk.strip():
                    chunks.append(current_chunk.strip())
                current_chunk = sentence

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks

    def query(self, query_text: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Query the vector store and return relevant chunks"""
        query_embedding = self.embedding_model.encode(query_text).tolist()

        search_results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k,
            score_threshold=self.config.SIMILARITY_THRESHOLD
        )

        results = []
        for result in search_results:
            results.append({
                "content": result.payload["content"],
                "source": result.payload["source"],
                "score": result.score
            })

        return results

    async def get_answer(self, query: str, user_id: str = None, language: str = 'en') -> Dict[str, Any]:
        """Get answer to query based on book content"""
        # Retrieve relevant chunks
        relevant_chunks = self.query(query, top_k=self.config.MAX_CONTEXT_LENGTH)

        if not relevant_chunks:
            result = {
                "answer": "I couldn't find relevant information in the book to answer your question.",
                "sources": [],
                "confidence": 0.0
            }
        else:
            # In a real implementation, we would use an LLM to generate an answer
            # based on the retrieved context. For now, we'll return the most relevant chunk.
            best_chunk = relevant_chunks[0]

            answer = f"Based on the book content: {best_chunk['content'][:500]}..."

            sources = [chunk["source"] for chunk in relevant_chunks]
            confidence = best_chunk["score"]

            result = {
                "answer": answer,
                "sources": sources,
                "confidence": confidence
            }

        # Apply language preference if needed
        if language == 'ur':
            result["answer"] = await self.urdu_service.translate_to_urdu(result["answer"])
            result["sources"] = [await self.urdu_service.translate_to_urdu(source) for source in result["sources"]]

        # Log the query if database is available
        if user_id:
            await self.db_manager.save_query_log(query, result["answer"], user_id)

        return result

    async def get_answer_for_selected_text(self, selected_text: str, question: str, user_id: str = None, language: str = 'en') -> Dict[str, Any]:
        """Get answer for a question about selected text"""
        # Combine the selected text with the question for a more targeted query
        combined_query = f"Regarding '{selected_text}', {question}"

        return await self.get_answer(combined_query, user_id, language)

    async def get_user_preferences(self, user_id: str) -> Dict[str, str]:
        """Get user preferences from database"""
        if not self.db_manager.pool:
            # Return default preferences if database not available
            return {"language_preference": "en", "preferred_format": "detailed"}

        try:
            async with self.db_manager.pool.acquire() as conn:
                row = await conn.fetchrow("""
                    SELECT language_preference, preferred_format
                    FROM user_preferences
                    WHERE user_id = $1
                """, user_id)

                if row:
                    return dict(row)
                else:
                    # Return default preferences if user not found
                    return {"language_preference": "en", "preferred_format": "detailed"}
        except Exception as e:
            logger.error(f"Failed to fetch user preferences: {e}")
            return {"language_preference": "en", "preferred_format": "detailed"}

    async def update_user_preferences(self, user_id: str, preferences: Dict[str, str]):
        """Update user preferences in database"""
        if not self.db_manager.pool:
            logger.warning("Database not connected, cannot update preferences")
            return

        try:
            async with self.db_manager.pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO user_preferences (user_id, language_preference, preferred_format)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (user_id)
                    DO UPDATE SET
                        language_preference = $2,
                        preferred_format = $3,
                        updated_at = NOW()
                """, user_id, preferences.get("language_preference", "en"), preferences.get("preferred_format", "detailed"))
        except Exception as e:
            logger.error(f"Failed to update user preferences: {e}")

    async def translate_entire_book(self, target_language: str) -> Dict[str, Any]:
        """Translate the entire book content to the target language"""
        try:
            # Get all book content from the vector store
            # In a real implementation, we would have a method to retrieve all content
            # For now, we'll simulate the process by getting all documents from the docs directory
            import os

            book_content = {}
            docs_path = self.config.BOOK_DOCS_PATH

            # Check if docs path exists
            if not os.path.exists(docs_path):
                logger.error(f"Docs path does not exist: {docs_path}")
                return {
                    "success": False,
                    "message": f"Book content directory not found: {docs_path}",
                    "target_language": target_language
                }

            for filename in os.listdir(docs_path):
                if filename.endswith('.md'):
                    try:
                        with open(os.path.join(docs_path, filename), 'r', encoding='utf-8') as f:
                            content = f.read()
                            # Translate the content using the Urdu service
                            if target_language == 'ur':
                                translated_content = await self.urdu_service.translate_to_urdu(content)
                            else:
                                # For other languages, we could integrate with other translation services
                                # For now, we'll just return the original content with a note
                                translated_content = f"[TRANSLATION TO {target_language.upper()} PLACEHOLDER]\n{content}"

                            book_content[filename] = {
                                'original': content,
                                'translated': translated_content
                            }
                    except Exception as file_error:
                        logger.error(f"Error reading file {filename}: {file_error}")
                        # Continue with other files even if one fails
                        continue

            if not book_content:
                logger.warning("No book content was found or translated")
                return {
                    "success": False,
                    "message": "No book content was found to translate",
                    "target_language": target_language
                }

            # In a real implementation, you would save the translated content to a file or database
            # and return the URL where it can be accessed
            return {
                "success": True,
                "message": f"Book translated to {target_language.upper()} successfully. {len(book_content)} files processed.",
                "total_files": len(book_content),
                "target_language": target_language,
                "translated_content": book_content
            }
        except Exception as e:
            logger.error(f"Error translating entire book: {e}")
            return {
                "success": False,
                "message": f"Failed to translate book: {str(e)}",
                "target_language": target_language
            }