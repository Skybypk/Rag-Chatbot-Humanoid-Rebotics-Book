// API service for communicating with the backend RAG system

const API_BASE_URL = 'http://localhost:8000';

interface QueryRequest {
  query: string;
  user_id?: string;
  language?: string;
}

interface TextSelectionRequest {
  selected_text: string;
  question: string;
  user_id?: string;
  language?: string;
}

interface QueryResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

interface TextSelectionResponse {
  answer: string;
  explanation: string;
}

interface TranslateBookRequest {
  target_language: string;
  user_id?: string;
}

interface TranslateBookResponse {
  success: boolean;
  message: string;
  translated_content_url?: string;
}

export const api = {
  async searchBook(query: string, user_id?: string, language: string = 'en'): Promise<QueryResponse> {
    try {
      // Using the POST endpoint instead of GET for better parameter handling
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          user_id: user_id,
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching book:', error);
      throw error;
    }
  },

  async queryBook(request: QueryRequest): Promise<QueryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error querying book:', error);
      throw error;
    }
  },

  async askAboutSelectedText(request: TextSelectionRequest): Promise<TextSelectionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/select-text-ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error asking about selected text:', error);
      throw error;
    }
  },

  async getUserPreferences(user_id: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/preferences?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  },

  async updateUserPreferences(user_id: string, preferences: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/preferences?user_id=${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
      });

      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  async translateBook(target_language: string, user_id?: string): Promise<TranslateBookResponse> {
    try {
      console.log(`Attempting to translate book to ${target_language} at ${API_BASE_URL}/translate-book`);
      const response = await fetch(`${API_BASE_URL}/translate-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_language: target_language,
          user_id: user_id
        }),
      });

      console.log(`Response status: ${response.status}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Translation response:', data);
      return data;
    } catch (error) {
      console.error('Error translating book:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Could not connect to the translation service. Please make sure the backend server is running on http://localhost:8000');
      }
      throw error;
    }
  },
};