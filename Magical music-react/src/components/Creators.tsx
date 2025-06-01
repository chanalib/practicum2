"use client";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Styles/creators.css";
import SearchAndSort from "./SearchAndSort"
import "./styles/search-sort.css"

interface Creator {
  id: number;
  name: string;
  songCount?: number
  createdAt?: string
  updatedAt?: string
}

const Creators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch("https://localhost:7157/api/creator");
        if (!response.ok) throw new Error("שגיאה בעת בקשת הנתונים");
        const data: Creator[] = await response.json();
        setCreators(data);
      } catch (err) {
        console.error("שגיאה בטעינת הזמרים:", err);
        setError("שגיאה בטעינת הזמרים");
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);
// Filter and sort creators
useEffect(() => {
  const filtered = creators.filter((creator) => {
    const searchLower = searchTerm.toLowerCase()
    return creator.name.toLowerCase().includes(searchLower)
  })

  // Sort creators
  filtered.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case "songCount":
        aValue = a.songCount || 0
        bValue = b.songCount || 0
        break
      case "created":
        aValue = new Date(a.createdAt || 0).getTime()
        bValue = new Date(b.createdAt || 0).getTime()
        break
      case "updated":
        aValue = new Date(a.updatedAt || 0).getTime()
        bValue = new Date(b.updatedAt || 0).getTime()
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  setFilteredCreators(filtered)
}, [creators, searchTerm, sortBy, sortOrder])

  const handleCreatorClick = (creatorId: number) => {
    console.log("נבחר זמר עם מזהה:", creatorId);
    navigate(`/creator/${creatorId}`);  // נווט לעמוד השירים של הזמר
  };

  const sortOptions = [
    { value: "name", label: "שם הזמר" },
    { value: "songCount", label: "כמות שירים" },
    { value: "created", label: "תאריך הצטרפות" },
    { value: "updated", label: "עדכון אחרון" },
  ]
  if (loading) {
    return (
      <div className="creators-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">טוען זמרים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="creators-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <p className="error-text">{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="creators-container">
      <div className="creators-header">
        <h1 className="creators-title">
          <span className="gradient-text"> הזמרים שלנו</span>
        </h1>
        <p className="creators-subtitle">גלו את האמנים הטובים ביותר במקום אחד!</p>
      </div>
 {/* Search and Sort */}
 <SearchAndSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        searchPlaceholder="חיפוש זמרים לפי שם..."
        sortOptions={sortOptions}
      />

      {/* Results Info */}
      <div className="results-info">
        <p className="results-text">
          {searchTerm ? (
            <>
              נמצאו <span className="highlight">{filteredCreators.length}</span> זמרים מתוך{" "}
              <span className="highlight">{creators.length}</span>
            </>
          ) : (
            <>
              סה"כ <span className="highlight">{creators.length}</span> זמרים
            </>
          )}
        </p>
      </div>

      {/* No Results */}
      {filteredCreators.length === 0 && searchTerm && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#d1d5db" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</div>
          <p>לא נמצאו זמרים התואמים לחיפוש "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm("")}
            style={{
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              border: "none",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              marginTop: "1rem",
            }}
          >
            נקה חיפוש
          </button>
        </div>
      )}

      {/* Creators Grid */}
      <div className="creators-grid">
        {filteredCreators.map((creator, index) => {
            return (
            <div
              key={creator.id}
              className="creator-card"
              onClick={() => handleCreatorClick(creator.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="creator-avatar">
                <span className="creator-initial">{creator.name.charAt(0)}</span>
              </div>
              <div className="creator-info">
                <h3 className="creator-name">{creator.name}</h3>
                <p className="creator-stats">
                <p className="creator-stats"> {creator.songCount || 0} שירים</p>
                </p>
              </div>
              <div className="creator-actions">
                <button className="play-button">▶️</button>
                <button className="favorite-button">❤️</button>
              </div>
              <div className="creator-glow"></div>
            </div>
          );
        })}
      </div>

      <div className="creators-footer">
        <button className="load-more-button">📥 טען עוד זמרים</button>
      </div>
    </div>
  );
};

export default Creators;
