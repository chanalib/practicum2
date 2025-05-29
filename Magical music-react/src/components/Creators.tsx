"use client";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./creators.css";

interface Creator {
  id: number;
  name: string;
  songCount: number;
}

const Creators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleCreatorClick = (creatorId: number) => {
    console.log("נבחר זמר עם מזהה:", creatorId);
    navigate(`/creator/${creatorId}`);  // נווט לעמוד השירים של הזמר
  };

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

      <div className="creators-grid">
        {creators.map((creator, index) => {
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
                  {creator.songCount > 0 ? `${creator.songCount} שירים` : "אין שירים עדיין"}
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
