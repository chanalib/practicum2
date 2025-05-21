"use client"

import type React from "react"

import { useState } from "react"
import { MusicInput } from "./music-input"
import { MusicButton } from "./music-button"

interface MusicSearchBarProps {
  onSearch: (query: string) => void
}

export function MusicSearchBar({ onSearch }: MusicSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg mx-auto">
      <MusicInput
        type="text"
        placeholder="חפש שיר..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="rounded-r-none"
        dir="rtl"
      />
      <MusicButton type="submit" className="rounded-l-md rounded-r-none">
        <SearchIcon className="h-5 w-5 ml-2" />
        <span>חיפוש</span>
      </MusicButton>
    </form>
  )
}

function SearchIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
}
