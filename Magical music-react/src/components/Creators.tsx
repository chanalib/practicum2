// // src/components/Creators.tsx
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { Button, Container, Typography, CircularProgress } from '@mui/material';
// import { useNavigate } from 'react-router-dom'; // עדכון כאן

// // הגדרת סוג הנתונים של Creator
// interface Creator {
//     id: number; 
//     name: string;
// }

// const Creators = () => {
//     const [creators, setCreators] = useState<Creator[]>([]);
//     const [loading, setLoading] = useState(true); 
//     const [error, setError] = useState<string | null>(null); 
//     const navigate = useNavigate(); 
//     useEffect(() => {
//         const fetchCreators = async () => {
//             try {
//                 const response = await axios.get<Creator[]>('https://localhost:7058/api/Creator');
//                 setCreators(response.data); // עדכון מצב היוצרים בנתונים שהתקבלו
//             } catch (err) {
//                 // טיפול בשגיאה
//                 if (axios.isAxiosError(err) && err.message) {
//                     setError(err.message); // עדכון מצב השגיאה
//                 } else {
//                     setError("An unexpected error occurred.");
//                 }
//             } finally {
//                 setLoading(false); // סיום טעינה
//             }
//         };

//         fetchCreators(); // קריאה לפונקציה
//     }, []); // [] - מבטיח שהקריאה תתבצע רק פעם אחת כאשר הקומפוננטה נטענת

//     if (loading) return <CircularProgress />; // הודעה בזמן טעינה
//     if (error) return <div>Error: {error}</div>; // הודעת שגיאה אם יש

//     return (
//         <Container>
//             <Typography variant="h4" gutterBottom>
//                 Creators List
//             </Typography>
//             {creators.map((creator) => (
//                 <Button 
//                     key={creator.id} 
//                     variant="contained" 
//                     color="primary" 
//                     onClick={() => navigate(`/songs/${creator.id}`)} 
//                     style={{ margin: '10px' }} // רווח בין הכפתורים
//                 >
//                     {creator.name}
//                 </Button>
//             ))}
//         </Container>
//     );
// };

// export default Creators;




"use client"

import { useEffect, useState } from "react"
import "./creators.css"
interface Creator {
  id: number
  name: string
}

const Creators = () => {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        // Mock data for demonstration
        const mockCreators: Creator[] = [
          { id: 1, name: "מרדכי בן דוד" },
          { id: 2, name: "שלמה כהן" },
          { id: 3, name: "אברהם פריד" },
          { id: 4, name: "יעקב שוואקי" },
          { id: 5, name: "אלי הרצליך" },
          { id: 6, name: "אבי אילסון" },
          { id: 7, name: "קובי ברומר" },
          { id: 8, name: "מנדי וייס" },
        ]

        // Simulate API delay
        setTimeout(() => {
          setCreators(mockCreators)
          setLoading(false)
        }, 1000)
      } catch (err) {
        setError("שגיאה בטעינת הזמרים")
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])

  const handleCreatorClick = (creatorId: number) => {
    console.log(`Navigate to creator ${creatorId}`)
    // כאן תוכל להוסיף ניווט לדף הזמר
  }

  if (loading) {
    return (
      <div className="creators-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">טוען זמרים...</p>
        </div>
      </div>
    )
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
    )
  }

  return (
    <div className="creators-container">
      <div className="creators-header">
        <h1 className="creators-title">
          <span className="gradient-text">🎤 הזמרים שלנו</span>
        </h1>
        <p className="creators-subtitle">גלו את האמנים הטובים ביותר במקום אחד</p>
      </div>

      <div className="creators-grid">
        {creators.map((creator, index) => (
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
              <p className="creator-stats">🎵 {Math.floor(Math.random() * 50) + 10} שירים</p>
            </div>
            <div className="creator-actions">
              <button className="play-button">▶️</button>
              <button className="favorite-button">❤️</button>
            </div>
            <div className="creator-glow"></div>
          </div>
        ))}
      </div>

      <div className="creators-footer">
        <button className="load-more-button">📥 טען עוד זמרים</button>
      </div>
    </div>
  )
}

export default Creators
