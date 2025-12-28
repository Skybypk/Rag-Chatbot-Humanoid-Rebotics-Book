# Humanoid Robotics Book - Backend Setup

## Prerequisites

Before starting the backend server, ensure you have:

1. Python 3.8 or higher
2. pip package manager

## Setup Instructions

### 1. Install Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd docusaurus-book/backend
pip install -r requirements.txt
```

### 2. Install Additional Dependencies (if needed)

Some packages might need to be installed separately:

```bash
pip install fastapi uvicorn qdrant-client sentence-transformers torch transformers python-dotenv
```

### 3. Start Qdrant Vector Database

The application uses Qdrant for vector storage. You need to have Qdrant running:

#### Option A: Using Docker (Recommended)
```bash
docker run -p 6333:6333 -p 6334:6334 \
    -e QDRANT__SERVICE__API_KEY=your-secret-key \
    --platform linux/amd64 \
    qdrant/qdrant
```

#### Option B: Using Docker without API Key (for development)
```bash
docker run -p 6333:6333 -p 6334:6334 \
    --platform linux/amd64 \
    qdrant/qdrant
```

### 4. Start the Backend Server

Once Qdrant is running, start the backend server:

```bash
cd docusaurus-book/backend
python run_server.py
```

The server will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint
- `POST /query` - Main RAG query endpoint
- `POST /select-text-ask` - Ask about selected text
- `GET /search` - Search endpoint
- `GET /health` - Health check endpoint
- `GET /user/preferences` - Get user preferences
- `POST /user/preferences` - Update user preferences
- `POST /translate-book` - Translate entire book

## Troubleshooting

### Common Issues:

1. **Port already in use**: Make sure no other service is running on port 8000
2. **Qdrant not running**: Ensure Qdrant vector database is running on localhost:6333
3. **Missing dependencies**: Install all requirements from requirements.txt
4. **Document path issues**: The server looks for book documents in `../docs/` relative to the backend directory

### Check if the server is running:

Visit `http://localhost:8000/health` in your browser or use curl:

```bash
curl http://localhost:8000/health
```

You should get a response: `{"status":"healthy"}`

### Check if documents are loaded:

The server automatically loads documents from the `../docs/` directory when it starts. Check the console output for messages like "Uploaded X points to Qdrant collection humanoid_robotics_book".

## Environment Variables

The server uses the following environment variables (defined in `.env`):

- `QDRANT_HOST` - Qdrant host (default: localhost)
- `QDRANT_PORT` - Qdrant port (default: 6333)
- `QDRANT_API_KEY` - Qdrant API key (if required)
- `COLLECTION_NAME` - Qdrant collection name (default: humanoid_robotics_book)
- `BOOK_DOCS_PATH` - Path to book documents (default: ../docs/)