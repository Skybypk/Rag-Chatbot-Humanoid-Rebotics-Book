from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import asyncio
import logging
from contextlib import asynccontextmanager
from services import RAGService

logger = logging.getLogger(__name__)

# Initialize RAG service globally
rag_service: RAGService = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global rag_service
    # Startup
    rag_service = RAGService()
    await rag_service.initialize_db()
    yield
    # Shutdown
    # Add cleanup code here if needed

app = FastAPI(
    title="Humanoid Robotics Book RAG API",
    version="1.0.0",
    lifespan=lifespan
)

class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = None  # For tracking user queries
    language: Optional[str] = 'en'  # Language preference: 'en' or 'ur'
    context_length: Optional[int] = 5  # Number of context chunks to return

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    confidence: float

class TextSelectionRequest(BaseModel):
    selected_text: str
    question: str
    user_id: Optional[str] = None  # For tracking user queries
    language: Optional[str] = 'en'  # Language preference: 'en' or 'ur'

class TextSelectionResponse(BaseModel):
    answer: str
    explanation: str

class UserPreferences(BaseModel):
    language_preference: Optional[str] = 'en'  # 'en', 'ur', etc.
    preferred_format: Optional[str] = 'detailed'  # 'detailed', 'brief', etc.

class UserPreferencesResponse(BaseModel):
    language_preference: str
    preferred_format: str

@app.get("/")
async def root():
    return {"message": "Humanoid Robotics Book RAG API"}

@app.post("/query", response_model=QueryResponse)
async def query_book(request: QueryRequest):
    """
    Main RAG endpoint - answers questions based ONLY on book text
    """
    global rag_service
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG service not initialized")

    result = await rag_service.get_answer(request.query, request.user_id, request.language)

    return QueryResponse(
        answer=result["answer"],
        sources=result["sources"],
        confidence=result["confidence"]
    )

@app.post("/select-text-ask", response_model=TextSelectionResponse)
async def select_text_ask(request: TextSelectionRequest):
    """
    Endpoint for the 'Select-text -> Ask AI' feature
    """
    global rag_service
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG service not initialized")

    result = await rag_service.get_answer_for_selected_text(
        request.selected_text,
        request.question,
        request.user_id,
        request.language
    )

    answer = result["answer"]
    explanation = f"This explanation is based on the book content and provides context for the selected text: '{request.selected_text}'"

    return TextSelectionResponse(answer=answer, explanation=explanation)

@app.get("/search", response_model=QueryResponse)
async def search_book(query: str, user_id: Optional[str] = None, language: Optional[str] = 'en'):
    """
    Search endpoint - answers questions based ONLY on book text
    """
    global rag_service
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG service not initialized")

    result = await rag_service.get_answer(query, user_id, language)

    return QueryResponse(
        answer=result["answer"],
        sources=result["sources"],
        confidence=result["confidence"]
    )

@app.get("/user/preferences", response_model=UserPreferencesResponse)
async def get_user_preferences(user_id: str):
    """
    Get user preferences (language, format, etc.)
    """
    global rag_service
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG service not initialized")

    preferences = await rag_service.get_user_preferences(user_id)
    return UserPreferencesResponse(
        language_preference=preferences.get("language_preference", "en"),
        preferred_format=preferences.get("preferred_format", "detailed")
    )

@app.post("/user/preferences", response_model=UserPreferencesResponse)
async def update_user_preferences(user_id: str, preferences: UserPreferences):
    """
    Update user preferences (language, format, etc.)
    """
    global rag_service
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG service not initialized")

    pref_dict = {
        "language_preference": preferences.language_preference,
        "preferred_format": preferences.preferred_format
    }

    await rag_service.update_user_preferences(user_id, pref_dict)

    return UserPreferencesResponse(
        language_preference=preferences.language_preference,
        preferred_format=preferences.preferred_format
    )

class TranslateBookRequest(BaseModel):
    target_language: str
    user_id: Optional[str] = None


class TranslateBookResponse(BaseModel):
    success: bool
    message: str
    translated_content_url: Optional[str] = None


@app.post("/translate-book", response_model=TranslateBookResponse)
async def translate_book(request: TranslateBookRequest):
    """
    Translate the entire book to the specified language
    """
    global rag_service
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG service not initialized")

    try:
        # Use the RAG service to translate the entire book
        result = await rag_service.translate_entire_book(request.target_language)

        if result["success"]:
            return TranslateBookResponse(
                success=True,
                message=result["message"],
                translated_content_url=f"/translated/{request.target_language}/book"
            )
        else:
            raise HTTPException(status_code=500, detail=result["message"])
    except Exception as e:
        logger.error(f"Error translating book: {e}")
        raise HTTPException(status_code=500, detail="Failed to translate book")


@app.get("/health")
async def health_check():
    return {"status": "healthy"}