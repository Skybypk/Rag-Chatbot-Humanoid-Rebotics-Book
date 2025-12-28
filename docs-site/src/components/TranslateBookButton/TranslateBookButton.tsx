import React, { useState } from 'react';
import { clientApi } from '@site/src/utils/clientApi';
import styles from './styles.module.css';

interface TranslateButtonProps {
  className?: string;
}

const TranslateBookButton: React.FC<TranslateButtonProps> = ({ className }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationComplete, setTranslationComplete] = useState(false);

  const handleTranslateToUrdu = async () => {
    if (isTranslating) return;

    setIsTranslating(true);
    setTranslationComplete(false);

    try {
      // Use client-side API for translation
      const response = await clientApi.translateBook('ur');

      if (response.success) {
        setTranslationComplete(true);
        // Show success message
        setTimeout(() => setTranslationComplete(false), 3000); // Clear message after 3 seconds
        alert(response.message || 'Book has been translated to Urdu successfully!');
      } else {
        console.error('Translation error:', response.message);
        alert(`Sorry, there was an error translating the book: ${response.message}`);
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      let errorMessage = 'Sorry, I encountered an error during translation. Please try again.';
      if (error.message) {
        errorMessage = `Translation failed: ${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className={`${styles['translation-controls']} ${className || ''}`}>
      <button
        onClick={handleTranslateToUrdu}
        disabled={isTranslating}
        className={styles['translate-whole-book-button']}
      >
        {isTranslating ? (
          <>
            <span className={styles['loading-spinner-inline']}></span> Translating to Urdu...
          </>
        ) : (
          '🇵🇰 Translate Whole Book to Urdu'
        )}
      </button>

      {translationComplete && (
        <div className={styles['translation-success-message']}>
          ✅ Translation to Urdu completed successfully!
        </div>
      )}
    </div>
  );
};

export default TranslateBookButton;