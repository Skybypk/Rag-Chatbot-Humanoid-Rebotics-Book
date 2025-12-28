from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Try to import RAG code
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
    return {"message": "API is working"}

@app.get("/api/chat")
async def chat(query: str):
    if RAG_AVAILABLE:
        answer = get_rag_response(query)  # Your RAG function
        return {"answer": answer, "status": "success", "source": "RAG"}
    else:
        return {"answer": f"You asked: {query}", "status": "success", "source": "fallback"}
