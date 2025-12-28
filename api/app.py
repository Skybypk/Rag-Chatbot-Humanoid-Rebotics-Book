from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# Try to import RAG
try:
    from rag_code import get_rag_response
    RAG_AVAILABLE = True
except ImportError:
    RAG_AVAILABLE = False

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API is working", "rag_available": RAG_AVAILABLE}

@app.get("/api/chat")
async def chat(query: str = Query(..., min_length=1)):
    if RAG_AVAILABLE:
        answer = get_rag_response(query)
        return {"answer": answer, "status": "success", "source": "RAG"}
    else:
        return {"answer": f"You asked: {query}", "status": "success", "source": "fallback"}

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "healthy", "service": "rag-chatbot-api", "rag_available": RAG_AVAILABLE}