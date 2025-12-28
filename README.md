# RAG Chatbot for Humanoid Robotics Book

This repository contains a complete Docusaurus documentation site with an integrated RAG (Retrieval-Augmented Generation) chatbot for the Humanoid Robotics Book. The chatbot can answer questions about the book's content using a custom RAG system.

## Features

- **Docusaurus Documentation Site**: Beautifully styled with custom feature cards and search functionality
- **RAG Chatbot**: AI-powered chatbot that can answer questions about the humanoid robotics book
- **Six Book Chapters**: Complete content on humanoid robotics, physical AI, and robot development
- **Responsive Design**: Works on all devices with dark mode support
- **Smart Search**: Search functionality to find content within the book

## Project Structure

```
├── api/                    # FastAPI backend with RAG system
│   ├── app.py             # Main API application
│   └── rag_code.py        # RAG system implementation
├── docs-site/             # Docusaurus documentation site
│   ├── docs/              # Book content in markdown
│   ├── src/               # Custom React components
│   │   ├── components/    # Feature cards, chatbot, etc.
│   │   └── pages/         # Homepage with chatbot widget
│   └── static/            # Images and static assets
└── README.md              # This file
```

## Installation

### Prerequisites

- Node.js (for Docusaurus)
- Python 3.8+ (for FastAPI)
- pip (Python package manager)

### Backend (API)

1. Navigate to the `api` directory:
```bash
cd api
```

2. Install Python dependencies:
```bash
pip install fastapi uvicorn python-multipart
```

3. Start the API server:
```bash
uvicorn app:app --reload --port 8000
```

### Frontend (Docusaurus)

1. Navigate to the `docs-site` directory:
```bash
cd docs-site
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The Docusaurus site will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

## Usage

1. Start both the API server and Docusaurus site
2. Visit `http://localhost:3000` in your browser
3. Use the search bar to find content or ask the chatbot questions about the book
4. The chatbot can answer questions like:
   - "What is the intro about this book?"
   - "How many chapters are in the book?"
   - "Tell me about physical AI"
   - "What topics does this book cover?"

## RAG System

The RAG (Retrieval-Augmented Generation) system is implemented in `api/rag_code.py` and:

- Loads content from all book markdown files in the `docs` directory
- Creates simple text embeddings for content retrieval
- Provides contextually relevant answers to user questions
- Handles common book-related queries with specific responses

## Custom Components

- **Feature Cards**: Six themed cards with blue borders and robotics icons
- **Search Bar**: Full-text search across all book content
- **Chatbot Widget**: Floating AI assistant in the bottom-right corner
- **Responsive Design**: Mobile-friendly layout with dark mode support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Add your license here]

## Contact

[Add your contact information]

Project Link: [https://github.com/yourusername/Rag-Chatbot-Humanoid-Rebotics-Book](https://github.com/yourusername/Rag-Chatbot-Humanoid-Rebotics-Book)