"use client"

import type React from "react"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import SongsDisplay from "./SongsDisplay"

interface Creator {
  id: number
  name: string
}

const CreatorSongs: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(`https://magical-music-server.onrender.com/api/creator/${id}`)
        if (response.ok) {
          const data = await response.json()
          setCreator(data)
        }
      } catch (error) {
        console.error("Error fetching creator:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCreator()
    }
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#d1d5db", marginTop: "120px" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
        <p>טוען פרטי זמר...</p>
      </div>
    )
  }

  return (
    <SongsDisplay
      title={`🎤 שירי ${creator?.name || "הזמר"}`}
      subtitle={`כל השירים של ${creator?.name || "הזמר הנבחר"}`}
      apiEndpoint={`https://magical-music-server.onrender.com//api/song/creator/${id}`}
    />
  )
}

export default CreatorSongs
