/sp.constitution

Project: AI-Native Textbook for Humanoid Robotics

Purpose:
Create a short, clean, professional AI-Native textbook based on the physical AI & Humanoid Robotics course. The book must serve as a fast, simple, high-quality learning resource built with a modern Docusaurus UI and a fully integrated free-tier RAG Chabot.

Scope:
- Short Chapters:
    1. Introduction to Physical AI
    2. Foundations of Robotics: Systems, Structure & Core Mechanisms
    3. Human-Inspired Design Principles in Humanoid Robotics
    4. Perception Systems in Humanoids
    5. AI, Deep Learning & Control Systems
    6. Humanoid Locomotion and Manipulation
- Clean UI
- Free-tier friendly
- Lightweight embeddings

Core Principles:
- Simplicity: The content should be easy to understand and the UI should be intuitive.
- Accuracy: All information must be correct and verifiable.
- Minimalism: Avoid unnecessary complexity in design and features.
- Fast builds: The Docusaurus site should build quickly.
- Free-tier architecture: All services used must have a generous free tier.
- RAG answer ONLY from book text: The chatbot's answers must be strictly based on the book's content.

Key Features & Standards:
- Textbook: Built with Docusaurus.
- RAG Chatbot: Utilizes Qdrant, Neon, and FastAPI.
- Select-text -> Ask AI: A feature allowing users to select text and ask the AI about it.
- Optional Features: Urdu personalization.
- Code Style: Adhere to Prettier and ESLint configurations within the Docusaurus project.
- Content Format: Markdown for all book chapters.

Constraints:
- No heavy GPU usage.
- Minimal and lightweight embeddings for the RAG model.
- All infrastructure must be compatible with free-tier services.

Success Criteria:
- Build Success: The Docusaurus site builds without errors.
- Accurate Chatbot: The RAG chatbot provides answers strictly from the book's content and is verified for accuracy.
- Clean UI: The user interface is modern, clean, and easy to navigate.
- Smooth Github Pages Deployment: The project can be deployed to GitHub Pages without issues.

Architectural Guidelines:
- Frontend: Docusaurus with React.
- Backend (RAG): FastAPI service.
- Database (Vector): Qdrant.
- Database (Relational): Neon.
- Deployment: GitHub Pages for the Docusaurus site, and a free-tier hosting provider for the FastAPI backend.