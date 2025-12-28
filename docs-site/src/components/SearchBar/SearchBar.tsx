import React, { useState, useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { api } from '@site/src/utils/api';
import { mockApi } from '@site/src/utils/mockApi';
import styles from './styles.module.css';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { colorMode } = useColorMode();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);

    try {
      // First check if the backend server is available
      const serverAvailable = await api.healthCheck();

      let response;
      if (serverAvailable) {
        // Use real API if server is available
        console.log('Using real API for search:', searchQuery); // Debug log
        response = await api.searchBook(searchQuery);
      } else {
        // Use mock API if server is not available
        console.log('Using mock API for search:', searchQuery); // Debug log
        response = await mockApi.searchBook(searchQuery);
      }

      console.log('Search response:', response); // Debug log

      // The response has the format: { answer: string, sources: string[], confidence: number }
      // We want to display the answer or sources
      if (response.answer) {
        // If there's an answer, we can show it as a result
        setResults([response.answer]);
      } else if (response.sources && response.sources.length > 0) {
        // If there are sources, show them
        setResults(response.sources);
      } else {
        // If no results found in the content, show a message
        setResults([`No content found for "${searchQuery}". Try different keywords.`]);
      }

      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      // If real API fails, try mock API as fallback
      try {
        console.log('Real API failed, trying mock API for search:', searchQuery); // Debug log
        const mockResponse = await mockApi.searchBook(searchQuery);
        console.log('Mock API response:', mockResponse); // Debug log

        if (mockResponse.answer) {
          setResults([mockResponse.answer]);
        } else if (mockResponse.sources && mockResponse.sources.length > 0) {
          setResults(mockResponse.sources);
        } else {
          setResults([`No content found for "${searchQuery}". Try different keywords.`]);
        }
      } catch (mockError) {
        console.error('Mock API also failed:', mockError);
        setResults(['Search service unavailable. Using mock search functionality.']);
      }
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for delayed search
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(value);
      }, 500); // 500ms delay
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`${styles['search-container']} ${colorMode}`}>
      <div className={styles['search-wrapper']}>
        <form className={styles['search-form']} onSubmit={handleSearchSubmit}>
          <div className={styles['search-input-container']}>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search through all book contents..."
              className={styles['search-input']}
              aria-label="Search books"
            />
            <button
              type="submit"
              className={styles['search-button']}
              disabled={isLoading}
              aria-label="Search"
            >
              {isLoading ? (
                <span className={styles['search-spinner']}>🔍</span>
              ) : (
                <span>🔍</span>
              )}
            </button>
          </div>
        </form>

        {showResults && results.length > 0 && (
          <div className={styles['search-results']}>
            <h3>Search Results</h3>
            <ul>
              {results.map((result, index) => (
                <li key={index} className={styles['search-result-item']}>
                  <div className={styles['result-content']}>
                    {result}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showResults && results.length === 0 && query && !isLoading && (
          <div className={styles['no-results']}>
            No results found for "{query}"
          </div>
        )}

        {showResults && results.length === 1 && (results[0].includes('Search service is not available') || results[0].includes('Search service unavailable')) && !isLoading && (
          <div className={styles['no-results']}>
            {results[0]}
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper to ensure it only runs in browser
const SearchBarWrapper: React.FC = () => {
  return (
    <BrowserOnly>
      {() => <SearchBar />}
    </BrowserOnly>
  );
};

export default SearchBarWrapper;