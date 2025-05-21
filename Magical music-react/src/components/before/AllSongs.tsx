import React, { useEffect, useState } from 'react';
import { MusicHeader } from '../music-header';
import { useNavigate } from 'react-router-dom';

interface Song {
    id: number;
    name: string;
    musicStyle: string;
    songLength: number;
    releaseDate: string;
    creatorId: number;
    imageUrl: string;
    key: string;
}

const AllSongs: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const navigate = useNavigate();

    function handleLogout(): void {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        navigate('/login');
    }

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch('https://localhost:7157/api/song');
                if (!response.ok) throw new Error('Network response was not ok');
                const data: Song[] = await response.json();
                setSongs(data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        fetchSongs();

        return () => {
            if (audio) {
                audio.pause();
                setAudio(null);
            }
        };
    }, []);

    const fetchPresignedUrl = async (key: string): Promise<string | null> => {
        try {
            const encodedKey = encodeURIComponent(key);
            const response = await fetch(`https://localhost:7157/api/song/presigned-url/${encodedKey}`);
            if (!response.ok) throw new Error('Failed to fetch presigned URL');
            const url = await response.text();
            return url;
        } catch (error) {
            console.error('Error fetching presigned URL:', error);
            return null;
        }
    };

    const playSong = async (key: string) => {
        if (audio) {
            audio.pause();
        }
        const url = await fetchPresignedUrl(key);
        if (url) {
            const newAudio = new Audio(url);
            newAudio.play();
            setAudio(newAudio);
        } else {
            alert('לא ניתן להשמיע את השיר כרגע');
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
    };

    return (
        <div>
            <MusicHeader onLogout={handleLogout} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {songs.map(song => (
                    <div key={song.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', width: '250px' }}>
                        <h3>{song.name}</h3>
                        <p><strong>סגנון:</strong> {song.musicStyle}</p>
                        <p><strong>אורך השיר:</strong> {formatDuration(song.songLength)}</p>
                        <p><strong>תאריך יציאה:</strong> {formatDate(song.releaseDate)}</p>
                        <audio controls src={song.imageUrl} style={{ width: '100%' }}>
                            הדפדפן שלך לא תומך בנגן אודיו.
                        </audio>
                        <button
                            style={{ marginTop: '0.5rem' }}
                            onClick={() => {
                                if (!song.key) {
                                    alert('שיר זה חסר קישור להפעלה');
                                    return;
                                }
                                playSong(song.key);
                            }}
                        >
                            נגן שיר
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllSongs;
