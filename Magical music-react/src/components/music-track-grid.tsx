// export function MusicTrackGrid() {
//     // This would be populated with actual music content from an API
//     const demoTracks = [
//       { id: 1, title: "שיר לדוגמה 1", artist: "אמן לדוגמה" },
//       { id: 2, title: "שיר לדוגמה 2", artist: "אמן לדוגמה" },
//       { id: 3, title: "שיר לדוגמה 3", artist: "אמן לדוגמה" },
//       { id: 4, title: "שיר לדוגמה 4", artist: "אמן לדוגמה" },
//       { id: 5, title: "שיר לדוגמה 5", artist: "אמן לדוגמה" },
//       { id: 6, title: "שיר לדוגמה 6", artist: "אמן לדוגמה" },
//     ]
  
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
//         {demoTracks.map((track) => (
//           <div
//             key={track.id}
//             className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-lg border border-gray-800 hover:border-purple-500 transition-all duration-300 group"
//           >
//             <div className="aspect-square bg-gray-800 rounded-md mb-4 overflow-hidden relative">
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             </div>
//             <h3 className="text-white font-medium mb-1">{track.title}</h3>
//             <p className="text-gray-400 text-sm">{track.artist}</p>
//           </div>
//         ))}
//       </div>
//     )
//   }
  