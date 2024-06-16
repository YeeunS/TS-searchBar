import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "../hooks/useDebounce";
import { useThrottle } from "../hooks/useThrottle";
import "./SearchBar.css";

const API_URL = "https://www.googleapis.com/books/v1/volumes";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const debouncedQuery = useDebounce(query, 300); // Use useDebounce hook
  const throttledQuery = useThrottle(debouncedQuery, 500); // Use useThrottle hook

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    console.log("Fetching suggestions for query:", searchQuery);
    if (searchQuery.length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          q: searchQuery,
          startIndex: 0,
          maxResults: 20,
        },
      });
      const titles = response.data.items.map(
        (item: any) => item.volumeInfo.title
      );

      setSuggestions(titles);
      console.log("Fetched titles:", titles);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, []);

  useEffect(() => {
    if (throttledQuery) {
      fetchSuggestions(throttledQuery);
    }
  }, [throttledQuery, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    console.log("Input changed to:", e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        setHighlightIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % suggestions.length;
          suggestionRefs.current[newIndex]?.scrollIntoView({
            block: "nearest",
          });
          return newIndex;
        });
        break;
      case "ArrowUp":
        setHighlightIndex((prevIndex) => {
          const newIndex =
            (prevIndex - 1 + suggestions.length) % suggestions.length;
          suggestionRefs.current[newIndex]?.scrollIntoView({
            block: "nearest",
          });
          return newIndex;
        });
        break;
      case "Enter":
        if (highlightIndex >= 0) {
          const selectedSuggestion = suggestions[highlightIndex];
          setQuery(selectedSuggestion);
          setSuggestions([]);
        }
        setHighlightIndex(-1);
        break;
      case "Escape":
        setSuggestions([]);
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
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
          placeholder=" "
        />
        <span className="input-title">Movie</span>
        {query && (
          <button className="clear-button" onClick={handleClear}>
            ×
          </button>
        )}
        <span className="arrow-icon">
          {query && suggestions.length > 0 ? "▲" : "▼"}
        </span>
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              ref={(el) => (suggestionRefs.current[index] = el)}
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
    </div>
  );
};

export default SearchBar;
