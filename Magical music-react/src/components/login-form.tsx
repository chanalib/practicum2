// "use client"

// import type React from "react"

// import { useState } from "react"
// import { MusicCard } from "./music-card"
// import { MusicInput } from "./music-input"
// import { MusicButton } from "./music-button"


// interface LoginFormProps {
//   onLogin: (email: string, password: string) => void
//   onRegisterClick: () => void
// }

// export function LoginForm({ onLogin, onRegisterClick }: LoginFormProps) {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // Simple validation
//     if (!email || !password) {
//       setError("יש למלא את כל השדות")
//       return
//     }

//     onLogin(email, password)
//   }

//   return (
//     <MusicCard>
//       <div className="text-center border-b border-gray-800 pb-6">
//         <h2 className="text-xl text-white">התחברות</h2>
//         <p className="text-gray-400 text-sm mt-1">התחבר כדי לגלות עולם של מוזיקה קסומה</p>
//       </div>

//       <div className="pt-6">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="email" className="text-sm font-medium text-gray-300 block text-right">
//               דואר אלקטרוני
//             </label>
//             <MusicInput
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="your@email.com"
//               dir="rtl"
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="password" className="text-sm font-medium text-gray-300 block text-right">
//               סיסמה
//             </label>
//             <MusicInput
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               dir="rtl"
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//           <MusicButton type="submit" fullWidth>
//             כניסה
//           </MusicButton>

//           <div className="text-center mt-4">
//             <p className="text-gray-400 text-sm">
//               עדיין לא נרשמת?{" "}
//               <span
//                 className="text-purple-400 font-medium cursor-pointer hover:text-pink-400 transition-colors"
//                 onClick={onRegisterClick}
//               >
//                 עליך להירשם למערכת כדי להיכנס
//               </span>
//             </p>
//           </div>
//         </form>
//       </div>
//     </MusicCard>
//   )
// }
