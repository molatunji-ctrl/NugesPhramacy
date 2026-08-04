import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("search") || "";
    }
    return "";
  });

  const navigate = useNavigate();

  const search = (q) => {
    const trimmed = q.trim();
    setQuery(trimmed);
    if (trimmed) {
      navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/shop");
    }
  };

  const clearSearch = () => {
    setQuery("");
    navigate("/shop");
  };

  return (
    <SearchContext.Provider value={{ query, setQuery, search, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}