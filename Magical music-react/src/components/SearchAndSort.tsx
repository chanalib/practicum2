"use client"

import type React from "react"
import { useState } from "react"

interface SearchAndSortProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  sortOrder: "asc" | "desc"
  onSortOrderChange: (order: "asc" | "desc") => void
  searchPlaceholder?: string
  sortOptions: { value: string; label: string }[]
}

const SearchAndSort: React.FC<SearchAndSortProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  searchPlaceholder = "חיפוש...",
  sortOptions,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <div className="search-sort-container">
      <div className="search-section">
        <div className={`search-input-wrapper ${isSearchFocused ? "focused" : ""}`}>
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => onSearchChange("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="sort-section">
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="sort-select">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className={`sort-order-btn ${sortOrder}`}
            onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
            title={sortOrder === "asc" ? "מיון עולה" : "מיון יורד"}
          >
            {sortOrder === "asc" ? "⬆️" : "⬇️"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchAndSort
