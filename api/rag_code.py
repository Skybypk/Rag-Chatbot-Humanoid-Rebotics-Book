"""
RAG (Retrieval-Augmented Generation) Chatbot for Humanoid Robotics Book
"""

import json
import numpy as np
from typing import List, Dict, Any, Optional
import re
import os

def load_book_content():
    """Load content from the book's markdown files"""
    content = []

    # Define the book directory path
    book_dir = os.path.join(os.path.dirname(__file__), '..', 'docs-site', 'docs')

    # List of markdown files to load
    book_files = [
        'intro.md',
        '01-introduction-to-physical-ai.md',
        '02-foundations-of-robotics.md',
        '03-human-inspired-design-principles.md',
        '04-perception-systems.md',
        '05-ai-deep-learning-and-control.md',
        '06-locomotion-and-manipulation.md'
    ]

    for filename in book_files:
        file_path = os.path.join(book_dir, filename)
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    file_content = f.read()
                    # Remove frontmatter (content between --- markers)
                    lines = file_content.split('\n')
                    content_text = []
                    in_frontmatter = False
                    for line in lines:
                        if line.strip() == '---':
                            in_frontmatter = not in_frontmatter
                            continue
                        if not in_frontmatter:
                            content_text.append(line)
                    clean_content = '\n'.join(content_text)

                    # Create a knowledge entry
                    content.append({
                        'id': len(content) + 1,
                        'filename': filename,
                        'content': clean_content,
                        'category': 'book_content'
                    })
            except Exception as e:
                print(f"Error reading {filename}: {e}")

    return content

class SimpleRAGSystem:
    """A simple RAG system for Humanoid Robotics Book knowledge"""

    def __init__(self):
        self.book_content = load_book_content()
        self.knowledge_base = self.book_content.copy()

        # Add some default responses for common questions
        default_responses = [
            {
                "id": 1000,
                "question": "What is the intro about this book?",
                "answer": self.get_intro_summary(),
                "category": "book_intro"
            },
            {
                "id": 1001,
                "question": "What is this book about?",
                "answer": self.get_book_summary(),
                "category": "book_overview"
            },
            {
                "id": 1002,
                "question": "Tell me about this book",
                "answer": self.get_book_summary(),
                "category": "book_overview"
            },
            {
                "id": 1003,
                "question": "What topics does this book cover?",
                "answer": self.get_book_topics(),
                "category": "book_topics"
            }
        ]

        self.knowledge_base.extend(default_responses)
        self.initialize_embeddings()

    def get_intro_summary(self):
        """Get a summary of the book's introduction"""
        for item in self.book_content:
            if 'intro.md' in item['filename']:
                content = item['content']
                # Extract the intro section
                lines = content.split('\n')
                intro_parts = []
                for line in lines:
                    if line.startswith('# Welcome to the Humanoid Robotics Book'):
                        continue
                    elif line.startswith('## About This Book'):
                        intro_parts.append("This book is a comprehensive guide on humanoid robotics that takes you on a journey through the fascinating world of physical artificial intelligence and humanoid robot development.")
                        continue
                    elif line.startswith('1. **Introduction to Physical AI**'):
                        intro_parts.append("The book is structured into six comprehensive chapters:")
                        intro_parts.append("- Introduction to Physical AI: Foundational concepts of AI integrated with physical systems")
                        intro_parts.append("- Foundations of Robotics: Core principles of robotics, systems, and mechanisms")
                        intro_parts.append("- Human-Inspired Design Principles: How human biology inspires robot design")
                        intro_parts.append("- Perception Systems: How robots sense and understand their environment")
                        intro_parts.append("- AI, Deep Learning & Control Systems: The brain and nervous system of robots")
                        intro_parts.append("- Humanoid Locomotion and Manipulation: How robots move and interact with the world")
                        break
                    elif len(intro_parts) > 0:
                        intro_parts.append(line)

                # If someone asks specifically about chapters, return just the chapter information
                return " ".join(intro_parts[:4]) if intro_parts else "This book is an introduction to humanoid robotics and physical AI."
        return "This book is a comprehensive guide on humanoid robotics that covers the fundamentals of physical AI, robot design, perception systems, and control mechanisms."

    def get_book_summary(self):
        """Get a general summary of the book"""
        return "This book is a comprehensive guide on humanoid robotics that takes you on a journey through the fascinating world of physical artificial intelligence and humanoid robot development. It covers topics from basic concepts to advanced applications in humanoid robotics."

    def get_book_topics(self):
        """Get the main topics covered in the book"""
        return "The book covers six main topics: 1) Introduction to Physical AI, 2) Foundations of Robotics, 3) Human-Inspired Design Principles, 4) Perception Systems, 5) AI, Deep Learning & Control Systems, and 6) Humanoid Locomotion and Manipulation."

    def initialize_embeddings(self):
        """Create simple text embeddings for knowledge base"""
        self.embeddings = []
        for item in self.knowledge_base:
            # Use both question and answer/content for embedding
            text = ""
            if 'question' in item and 'answer' in item:
                text = f"{item['question']} {item['answer']} {item['category']}"
            else:
                text = f"{item['filename']} {item['content'][:500]} {item['category']}"  # Limit content length for performance

            # Simple keyword-based "embedding"
            embedding = self.text_to_simple_embedding(text)
            self.embeddings.append({
                "id": item["id"],
                "embedding": embedding,
                "data": item
            })

    def text_to_simple_embedding(self, text: str) -> Dict[str, int]:
        """Convert text to simple keyword frequency embedding"""
        words = re.findall(r'\b\w+\b', text.lower())
        embedding = {}
        for word in words:
            if len(word) > 2:  # Ignore very short words
                embedding[word] = embedding.get(word, 0) + 1
        return embedding

    def cosine_similarity(self, embed1: Dict, embed2: Dict) -> float:
        """Calculate simple cosine similarity between embeddings"""
        if not embed1 or not embed2:
            return 0.0

        # Get all unique words
        all_words = set(list(embed1.keys()) + list(embed2.keys()))

        # Create vectors
        vec1 = [embed1.get(word, 0) for word in all_words]
        vec2 = [embed2.get(word, 0) for word in all_words]

        # Calculate cosine similarity
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = sum(a * a for a in vec1) ** 0.5
        norm2 = sum(b * b for b in vec2) ** 0.5

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return dot_product / (norm1 * norm2)

    def retrieve_relevant_context(self, query: str, top_k: int = 3) -> List[Dict]:
        """Retrieve most relevant knowledge base entries for query"""
        query_embedding = self.text_to_simple_embedding(query)

        # Calculate similarities
        similarities = []
        for item in self.embeddings:
            similarity = self.cosine_similarity(query_embedding, item["embedding"])
            similarities.append((similarity, item["data"]))

        # Sort by similarity (descending)
        similarities.sort(key=lambda x: x[0], reverse=True)

        # Return top-k results
        return [item[1] for item in similarities[:top_k] if item[0] > 0.05]  # Lowered threshold to find more matches

    def generate_response(self, query: str, contexts: List[Dict]) -> str:
        """Generate response based on retrieved contexts"""
        if not contexts:
            return f"I don't have specific information about '{query}' in the book. The book covers topics like physical AI, robot foundations, human-inspired design, perception systems, AI & control, and locomotion. Try asking about these topics!"

        # Check if any context has a direct answer
        for context in contexts:
            if 'answer' in context:
                # Check if this is a specific answer to a common question
                if any(keyword in query.lower() for keyword in ['intro', 'introduction', 'about this book', 'what is this book', 'chapters', 'topics']):
                    return context['answer']

        # Combine relevant contexts
        responses = []
        for context in contexts:
            if 'answer' in context:
                responses.append(context['answer'])
            elif 'content' in context:
                # Extract relevant parts from the book content based on the query
                content = context['content']
                query_words = query.lower().split()

                # Find relevant paragraphs containing query terms
                paragraphs = content.split('\n\n')
                relevant_paragraphs = []
                for para in paragraphs:
                    if any(word.lower() in para.lower() for word in query_words):
                        # If asking about chapters, try to extract just the chapter count
                        if any(word in query.lower() for word in ['chapters', 'chapter', 'how many']):
                            if 'six' in para.lower() and any(word in para.lower() for word in ['chapter', 'chapters', 'six comprehensive']):
                                relevant_paragraphs.append(para.strip())
                                break
                        else:
                            relevant_paragraphs.append(para.strip())

                if relevant_paragraphs:
                    responses.append(' '.join(relevant_paragraphs[:1]))  # Take only first relevant paragraph
                else:
                    # Return the first part of the content if no specific match found
                    responses.append(content[:300])  # Limit length

        return ' '.join(responses[:1]) if responses else f"I don't have specific information about '{query}' in the book."

    def process_query(self, query: str) -> str:
        """Main RAG processing function"""
        # Clean query
        query = query.strip()
        if not query or len(query) < 2:
            return "Please ask a question about the humanoid robotics book."

        # Special greetings
        greetings = ["hello", "hi", "hey", "greetings"]
        if any(greet in query.lower() for greet in greetings):
            return "Hello! I'm a RAG chatbot specialized in the Humanoid Robotics Book. Ask me about the book's content, chapters, or specific topics!"

        # Handle specific questions directly
        query_lower = query.lower()
        if any(word in query_lower for word in ['how many chapters', 'chapters', 'number of chapters', 'chapter count']):
            return "The book is structured into six comprehensive chapters."

        # Retrieve relevant context
        contexts = self.retrieve_relevant_context(query)

        # Generate response
        response = self.generate_response(query, contexts)

        return response

# Initialize RAG system
rag_system = SimpleRAGSystem()

def get_rag_response(query: str) -> str:
    """
    Main function to be called from app.py
    Returns RAG response for the given query
    """
    try:
        return rag_system.process_query(query)
    except Exception as e:
        return f"Error processing query: {str(e)}. Please try again with a different question about the humanoid robotics book."

# For testing
if __name__ == "__main__":
    # Test the RAG system
    test_queries = [
        "What is the intro about this book?",
        "What is this book about?",
        "Tell me about this book",
        "What topics does this book cover?",
        "hello"
    ]

    for query in test_queries:
        print(f"\nQ: {query}")
        print(f"A: {get_rag_response(query)}")
        print("-" * 50)