import React, { useState, useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { api } from '@site/src/utils/api';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', content: 'Hello! I\'m your Humanoid Robotics Book assistant. Ask me anything about the content in the book!', role: 'assistant', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [userLanguage, setUserLanguage] = useState('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to get selected text
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim() !== '') {
        const selectedText = selection.toString().trim();
        if (selectedText && selectedText.length > 10) { // Only capture meaningful selections
          setSelectedText(selectedText);
        } else {
          setSelectedText(''); // Clear if selection is too short
        }
      } else {
        setSelectedText(''); // Clear if no selection
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await api.queryBook({
        query: inputValue,
        language: userLanguage
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAboutSelection = async () => {
    if (!selectedText.trim() || isLoading) return;

    // Add user message about selected text
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `About this text: "${selectedText}"`,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await api.askAboutSelectedText({
        selected_text: selectedText,
        question: "Can you explain this concept from the book?",
        language: userLanguage
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserLanguage(e.target.value);
  };

  return (
    <div className={`chat-container ${colorMode}`}>
      <div className="chat-header">
        <h3>Humanoid Robotics Book Assistant</h3>
        <div className="language-selector">
          <label htmlFor="language-select">Language: </label>
          <select
            id="language-select"
            value={userLanguage}
            onChange={handleLanguageChange}
            className="language-dropdown"
          >
            <option value="en">English</option>
            <option value="ur">Urdu</option>
          </select>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role}`}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {selectedText && (
        <div className="selected-text-notice">
          <p>Selected: "{selectedText.substring(0, 60)}{selectedText.length > 60 ? '...' : ''}"</p>
          <button
            onClick={handleAskAboutSelection}
            disabled={isLoading}
            className="ask-selection-button"
          >
            Ask about this text
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about humanoid robotics..."
          disabled={isLoading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="chat-submit-button"
        >
          Send
        </button>
      </form>
    </div>
  );
};

// Wrapper to ensure it only runs in browser
const ChatInterfaceWrapper: React.FC = () => {
  return (
    <BrowserOnly>
      {() => <ChatInterface />}
    </BrowserOnly>
  );
};

export default ChatInterfaceWrapper;