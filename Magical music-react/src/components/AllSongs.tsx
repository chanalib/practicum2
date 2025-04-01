import React, { useEffect, useState } from 'react';

const AllSongs: React.FC = () => {
    const [songs, setSongs] = useState<string[]>([]);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        // פונקציה לקבלת רשימת השירים
        const fetchSongs = async () => {
            try {
                const response = await fetch('http://localhost:7058/api/s3/files');
                const data = await response.json();
                setSongs(data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        fetchSongs();
    }, []);

    const playSong = (fileName: string) => {
        if (audio) {
            audio.pause(); // עצור שיר קיים אם יש
        }
        
        const newAudio = new Audio(`http://localhost:7058/api/s3/download/${fileName}`);
        newAudio.play();
        setAudio(newAudio);
    };

    return (
        <div>
            <h1>כל השירים</h1>
            <ul>
                {songs.map((song) => (
                    <li key={song} onClick={() => playSong(song)}>
                        {song}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllSongs;
