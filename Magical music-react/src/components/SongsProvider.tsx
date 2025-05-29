// import { useEffect, useState } from 'react';
// import { Song } from '../services/types';
// import { getAllSongs, getSongsByCreator } from '../services/songService';

// export function SongsProvider(creatorId?: string) {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);

//     const fetch = async () => {
//       try {
//         const data = creatorId ? await getSongsByCreator(creatorId) : await getAllSongs();
//         setSongs(data);
//       } catch (err) {
//         console.error('שגיאה בטעינת שירים', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetch();
//   }, [creatorId]);

//   return { songs, loading };
// }
