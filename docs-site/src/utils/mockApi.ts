// Mock API service for search functionality when backend is not available
import bookContent from '../data/bookContent.json'; // This will contain your book content

// Define the same interfaces as the real API
interface QueryResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

interface TranslateBookResponse {
  success: boolean;
  message: string;
  translated_content_url?: string;
}

// Simple search function that looks for matches in the book content
const searchInContent = (query: string, content: any): QueryResponse => {
  const searchTerms = query.toLowerCase().split(' ');
  const results: { source: string; content: string; score: number }[] = [];

  for (const [filename, data] of Object.entries(content)) {
    const text = typeof data === 'object' && data.content ? data.content : data;
    if (typeof text === 'string') {
      // Count matches of search terms in the content
      let matchCount = 0;
      const lowerText = text.toLowerCase();

      for (const term of searchTerms) {
        if (lowerText.includes(term)) {
          matchCount++;
        }
      }

      if (matchCount > 0) {
        // Calculate a simple relevance score based on match count
        const score = matchCount / searchTerms.length;
        results.push({
          source: filename,
          content: text.substring(0, 500) + '...', // First 500 chars
          score
        });
      }
    }
  }

  // Sort by score (relevance)
  results.sort((a, b) => b.score - a.score);

  if (results.length > 0) {
    // Return the best match
    const bestMatch = results[0];
    return {
      answer: `Found in ${bestMatch.source}: ${bestMatch.content}`,
      sources: [bestMatch.source],
      confidence: bestMatch.score
    };
  } else {
    return {
      answer: "No content found in the book for your query.",
      sources: [],
      confidence: 0
    };
  }
};

// Mock API object
export const mockApi = {
  async searchBook(query: string, user_id?: string, language: string = 'en'): Promise<QueryResponse> {
    // In a real implementation, this would load content from your docs directory
    // For now, we'll simulate it with some sample content
    const mockContent = {
      '01-introduction-to-physical-ai.md': {
        content: `# Introduction to Physical AI

Physical AI is an interdisciplinary field that combines artificial intelligence with robotics. It focuses on creating intelligent systems that can interact with the physical world effectively. This field encompasses machine learning, computer vision, robotics, and control systems.

Key concepts in Physical AI include perception, decision-making, and action in physical environments. These systems must be able to sense their environment, process information, and execute appropriate actions.`
      },
      '02-foundations-of-robotics.md': {
        content: `# Foundations of Robotics: Systems, Structure & Core Mechanisms

Robotics is the branch of technology that deals with the design, construction, operation, and application of robots. It closely relates to AI, as robots often require intelligent behavior to perform their tasks effectively.

The core components of a robotic system include sensors for perception, actuators for movement, and controllers for decision-making. Modern robots also incorporate AI algorithms for navigation, object recognition, and task planning.`
      },
      '03-human-inspired-design-principles.md': {
        content: `# Human-Inspired Design Principles

Human-inspired design in robotics draws from biological systems to create more effective and intuitive robotic solutions. This approach, also known as biomimetics, looks at how humans and animals solve problems and applies these principles to robot design.

Key principles include modular design, adaptability, and energy efficiency. By studying human locomotion, manipulation, and cognitive processes, engineers can create robots that are more compatible with human environments and expectations.`
      },
      '04-perception-systems.md': {
        content: `# Perception Systems

Perception systems in robotics enable robots to understand their environment through various sensors. These systems process data from cameras, lidar, radar, and other sensors to build a representation of the world around them.

Computer vision is a critical component of perception systems, allowing robots to recognize objects, understand spatial relationships, and navigate through complex environments. Modern perception systems often use deep learning algorithms for object detection and scene understanding.`
      },
      '05-ai-deep-learning-and-control.md': {
        content: `# AI, Deep Learning and Control

The integration of AI and deep learning techniques has revolutionized robotic control systems. These approaches allow robots to learn from experience, adapt to new situations, and perform complex tasks that were previously impossible with traditional programming methods.

Deep learning networks can process high-dimensional sensor data and learn complex control policies. Reinforcement learning enables robots to improve their performance through trial and error in simulated or real environments.`
      },
      '06-locomotion-and-manipulation.md': {
        content: `# Locomotion and Manipulation

Locomotion and manipulation are fundamental capabilities for physical AI systems. Locomotion refers to the ability to move through an environment, while manipulation involves interacting with objects.

Robots use various locomotion methods including wheeled, legged, and tracked systems. Manipulation involves precise control of robotic arms and hands to grasp, move, and interact with objects. Advanced manipulation systems can perform delicate tasks requiring fine motor control.`
      }
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(searchInContent(query, mockContent));
      }, 300); // Simulate network delay
    });
  },

  async healthCheck(): Promise<boolean> {
    // Always return true for mock service
    return Promise.resolve(true);
  },

  async translateBook(target_language: string, user_id?: string): Promise<TranslateBookResponse> {
    return Promise.resolve({
      success: false,
      message: "Translation service not available in mock mode"
    });
  }
};