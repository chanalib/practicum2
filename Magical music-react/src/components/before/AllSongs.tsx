import React, { useEffect, useState, useRef, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './AllSongs.css';
// import { MusicHeader } from '../music-header';

interface Song {
  id: number;
  name: string;
  musicStyle: string;
  songLength: number;
  releaseDate: string;
  creatorId: number;
  S3Url: string;
  key: string;
}

const AllSongs: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
//   const navigate = useNavigate();

  const currentSong = useMemo(() => {
    return currentSongIndex !== null && songs.length > 0 ? songs[currentSongIndex] : null;
  }, [currentSongIndex, songs]);

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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentSongIndex === null || songs.length === 0) return;

    const loadAndPlaySong = async () => {
      const song = songs[currentSongIndex];

      try {
        const response = await fetch(
          `https://localhost:7157/api/s3/presigned-url?key=${encodeURIComponent(song.key)}`
        );
        if (!response.ok) throw new Error('Failed to fetch presigned URL');
        const url = await response.text();

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }

        const audio = new Audio(url);
        audio.playbackRate = playbackRate;

        audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
        audio.onloadedmetadata = () => setDuration(audio.duration);
        audio.onended = () => {
          setIsPlaying(false);
          playNextSong();
        };

        await audio.play();
        setIsPlaying(true);
        audioRef.current = audio;
      } catch (error) {
        alert('לא ניתן לנגן את השיר כרגע');
        console.error(error);
      }
    };

    loadAndPlaySong();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentSongIndex, playbackRate, songs]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNextSong = () => {
    if (currentSongIndex === null || songs.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
  };

  const playPreviousSong = () => {
    if (currentSongIndex === null || songs.length === 0) return;
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

//   function handleLogout() {
//     localStorage.removeItem('userToken');
//     localStorage.removeItem('userData');
//     navigate('/login');
//   }

  return (
    <div>
      {/* <MusicHeader onLogout={handleLogout} /> */}
      {/* רשימת שירים */}
      <div className="songs-container">
        {songs.map((song, index) => (
          <div key={song.id} className="song-card">
            <h3 className="song-title">{song.name}</h3>
            <p><strong>סגנון:</strong> {song.musicStyle}</p>
            <p><strong>אורך השיר:</strong> {formatTime(song.songLength)}</p>
            <p><strong>תאריך יציאה:</strong> {new Date(song.releaseDate).toLocaleDateString()}</p>
            <button className="play-btn" onClick={() => setCurrentSongIndex(index)}>▶️ נגן</button>
            <button
              className="download-btn"
              onClick={async () => {
                try {
                  const urlResponse = await fetch(
                    `https://localhost:7157/api/s3/presigned-url?key=${encodeURIComponent(song.key)}&download=true`
                  );
                  if (!urlResponse.ok) throw new Error('Failed to fetch download URL');
                  const url = await urlResponse.text();
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = song.key.split('/').pop() || 'song.mp3';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } catch {
                  alert('לא ניתן להוריד את השיר כרגע');
                }
              }}
            >
              ⬇️ הורדה
            </button>
          </div>
        ))}
      </div>

      {/* נגן שיר עם אנימציה */}
      <AnimatePresence mode="wait">
        {currentSong && (
          <motion.div
            key={currentSong.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="audio-player"
          >
            <span className="current-song-name">🎵 {currentSong.name}</span>
            <div className="controls-row">
              <button onClick={togglePlayPause} className="control-btn">
                {isPlaying ? '⏸' : '▶️'}
              </button>
              <button onClick={playPreviousSong} className="control-btn">
                ⏮️ הקודם
              </button>
              <button onClick={playNextSong} className="control-btn">
                ⏭️ הבא
              </button>
            </div>
            <div className="controls-row">
              <label htmlFor="playbackRate">מהירות:</label>
              <select
                id="playbackRate"
                value={playbackRate}
                onChange={handleRateChange}
                className="playback-rate-select"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
            <div className="seek-row">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="seek-bar"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllSongs;
