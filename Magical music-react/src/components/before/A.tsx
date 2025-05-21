// import React, { useEffect, useState } from 'react';

// const A: React.FC = () => {
//     const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
//     const [songs, setSongs] = useState<string[]>([]); // רשימת השירים

//     useEffect(() => {
//         // פונקציה לקבלת רשימת השירים
//         const fetchSongs = async () => {
//             try {
//                 const response = await fetch('http://localhost:7058/api/s3/files');
//                 const data = await response.json();
//                 setSongs(data); // עדכן את רשימת השירים
//             } catch (error) {
//                 console.error('Error fetching songs:', error);
//             }
//         };

//         fetchSongs();
//     }, []);

//     const playSong = (song: string) => {
//         if (audio) {
//             audio.pause(); // עצור שיר קיים אם יש
//         }

//         const newAudio = new Audio(`http://localhost:7058/api/s3/download/${song}`);
//         newAudio.play();
//         setAudio(newAudio);
//     };

//     return (
//         <div>
//             <h1>כל השירים</h1>
//             <ul>
//                 {songs.map((song) => (
//                     <li key={song} onClick={() => playSong(song)}>
//                         {song}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default A;
