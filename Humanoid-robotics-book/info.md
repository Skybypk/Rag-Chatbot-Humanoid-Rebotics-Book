purpose:
create a short, clean, professional AI-Native textbook based on the physical AI & Humanoid Robotics course.
The book must server as a fast, simple, high-quality learning resource built with a modern Docusaurus UI  and a fully integrated free-tier RAG Chabot.

Scope:
Short Chapters:
1. Introduction to Physical AI
2. Foundations of Robotics: Systems, Structure & Core Mechanisms
3. Human-Inspired Design Principles in Humanoid Robotics
4. Perception Systems in Humanoids
5. AI, Deep Learning & Control Systems
6. Humanoid Locomotion and Manipulation
-Clean UI
-Free-tier friendly
-Lightweight embeddings

Core Principles:
-Simplicity
-Accuracy
-Minimalism
-Fast builds
-Free-tier architecture
-100% works six Cards individual after clicking and navigate to sidebar sections.
-RAG answer ONLY from book text

Key Features:
-Docusaurus textbook
-RAG chatbot (Qdrant + Neon + FastAPI)
-Select-text -> Ask AI 
-Optional urdu / personalize features

Constraints:
-No heavy GPU usage
-Minimal embeddings

Success Criteria:
-Build success 
-Accurate chatbot 
-Clean UI
-Smooth Github pages deployment 
 
Generate full constitution.

In footer you create the social meida i con left side icon only Facebook and Instagrame and right side in linkedin and X icon.

Task is after hero sections all text button must be clickable.
Task is samrt favicon create for this book and apply.


Claude, I need help fixing my Docusaurus + FastAPI RAG chatbot integration.

**PROBLEM:**
1. I added a chatbot component to `docs-site/src/pages/index.tsx` but it's taking over the ENTIRE page
2. The default Docusaurus template/design has disappeared
3. Chatbot should only be a small widget in the sidebar or a section, not the whole page
4. The chatbot works (API responds) but styling is broken

**CURRENT STRUCTURE:**
- Docusaurus (React/TypeScript) on `localhost:3000`
- FastAPI RAG backend on `localhost:8000`
- Chatbot integrated in `index.tsx` but overrides everything

**WHAT I WANT:**
1. RESTORE the original Docusaurus landing page design
2. Add chatbot as a SMALL widget (sidebar or corner button that expands)
3. OR add chatbot as a SECTION on the homepage, not the entire page
4. Keep API integration working (already works)

**FILES:**
- `docs-site/src/pages/index.tsx` - Main homepage (overwritten)
- `docs-site/src/pages/index.css` - Custom CSS
- `api/app.py` - FastAPI backend (working)
- `api/rag_code.py` - RAG system (working)

**REQUIREMENTS:**
1. Minimal changes - preserve Docusaurus defaults
2. Chatbot should be subtle, not dominant
3. Responsive design
4. Working API calls to `localhost:8000/api/chat`

Please provide:
1. Correct `index.tsx` that RESTORES Docusaurus default template + adds chatbot widget
2. Simple CSS for chatbot widget
3. Instructions where to place the chatbot code

You applying this types f six cards picture is below.
(<pic- 02.png>)