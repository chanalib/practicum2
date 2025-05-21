// src/components/Creators.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // עדכון כאן

// הגדרת סוג הנתונים של Creator
interface Creator {
    id: number; 
    name: string;
}

const Creators = () => {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null); 
    const navigate = useNavigate(); 
    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const response = await axios.get<Creator[]>('https://localhost:7058/api/Creator');
                setCreators(response.data); // עדכון מצב היוצרים בנתונים שהתקבלו
            } catch (err) {
                // טיפול בשגיאה
                if (axios.isAxiosError(err) && err.message) {
                    setError(err.message); // עדכון מצב השגיאה
                } else {
                    setError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false); // סיום טעינה
            }
        };

        fetchCreators(); // קריאה לפונקציה
    }, []); // [] - מבטיח שהקריאה תתבצע רק פעם אחת כאשר הקומפוננטה נטענת

    if (loading) return <CircularProgress />; // הודעה בזמן טעינה
    if (error) return <div>Error: {error}</div>; // הודעת שגיאה אם יש

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Creators List
            </Typography>
            {creators.map((creator) => (
                <Button 
                    key={creator.id} 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate(`/songs/${creator.id}`)} 
                    style={{ margin: '10px' }} // רווח בין הכפתורים
                >
                    {creator.name}
                </Button>
            ))}
        </Container>
    );
};

export default Creators;
