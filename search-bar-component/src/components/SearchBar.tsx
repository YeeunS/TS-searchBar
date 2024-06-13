import React, { useState, useCallback } from "react";
import axios from "axios";
import "./SearchBar.css";

const API_URL = "https://www.googleapis.com/books/v1/volumes";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [results, setResults] = useState<string[]>([]);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}?q=${searchQuery}&startIndex=0&maxResults=20`
      );
      const titles = response.data.items.map(
        (item: any) => item.volumeInfo.title
      );

      const sortedTitles = titles.sort((a: string, b: string) => {
        if (
          a.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
          !b.toLowerCase().startsWith(searchQuery.toLowerCase())
        ) {
          return -1;
        }
        if (
          !a.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
          b.toLowerCase().startsWith(searchQuery.toLowerCase())
        ) {
          return 1;
        }
        return a.localeCompare(b);
      });

      console.log("Fetched titles:", sortedTitles);
      setSuggestions(sortedTitles);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, []);

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (searchQuery.length === 0) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}?q=${searchQuery}&startIndex=0&maxResults=20`
      );
      const titles = response.data.items.map(
        (item: any) => item.volumeInfo.title
      );
      setResults(titles);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log("Input changed to:", newQuery);
    setQuery(newQuery);
    fetchSuggestions(newQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0) {
        setQuery(suggestions[highlightIndex]);
        setSuggestions([]);
        fetchResults(suggestions[highlightIndex]);
      } else {
        fetchResults(query);
      }
      setHighlightIndex(-1);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    fetchResults(suggestion);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setResults([]);
  };

  const handleBlur = () => {
    setTimeout(() => setSuggestions([]), 100);
  };

  return (
    <div className="search-bar">
      <div className="input-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Movie"
        />
        {query && (
          <button className="clear-button" onClick={handleClear}>
            ×
          </button>
        )}
        <button className="dropdown-button">▼</button>
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion}-${index}`}
              className={index === highlightIndex ? "highlighted" : ""}
              onMouseEnter={() => setHighlightIndex(index)}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {results.length > 0 && (
        <div className="results-list">
          <h2>Search Results:</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
