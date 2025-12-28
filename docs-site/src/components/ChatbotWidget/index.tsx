import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type ChatbotWidgetProps = {
  className?: string;
};

const ChatbotWidget = (props: ChatbotWidgetProps): JSX.Element => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/chat?query=${encodeURIComponent(query.trim())}`
      );
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer('Error: Could not connect to chatbot server.');
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  return (
    <div className={clsx(styles.chatbotWidget, props.className)}>
      {/* Chatbot Toggle Button */}
      <button
        className={clsx(styles.chatbotButton, styles.floatingButton)}
        onClick={() => setShowChat(!showChat)}
        aria-label={showChat ? 'Close chatbot' : 'Open chatbot'}
      >
        🤖
      </button>

      {/* Chatbot Window */}
      {showChat && (
        <div className={styles.chatbotWindow}>
          <div className={styles.chatbotHeader}>
            <h4 className={styles.chatbotTitle}>🤖 Robotics Chatbot</h4>
            <button
              className={styles.closeButton}
              onClick={() => setShowChat(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about humanoid robotics..."
            className={styles.chatbotInput}
            aria-label="Enter your question for the chatbot"
          />

          <button
            onClick={handleAsk}
            disabled={loading}
            className={clsx(styles.chatbotSubmitButton, {
              [styles.loading]: loading
            })}
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>

          {answer && (
            <div className={styles.chatbotResponse}>
              <strong>Answer:</strong> {answer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;