
"use client"

import type React from "react"
import SongsDisplay from "./SongsDisplay"

const AllSongs: React.FC = () => {
  return (
    <SongsDisplay
      title="גלריית השירים"
      subtitle="גלו את השירים הטובים ביותר במקום אחד"
      apiEndpoint="https://localhost:7157/api/song"
    />
  )
}

export default AllSongs
