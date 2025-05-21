"use client"

import { useNavigate } from 'react-router-dom'; // עדכון כאן
import { MusicBackgroundAnimation } from "../components/music-background-animation"
import { MusicLogo } from "../components/music-logo"
import { LoginForm } from "../components/login-form"

export default function LoginPage() {
  const navigate = useNavigate(); // עדכון כאן

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials against a backend
    // For demo purposes, we'll just navigate to the home page
    navigate("/home"); // שימוש נכון בניווט
  }

  const goToRegister = () => {
    navigate("/register"); // שימוש נכון בניווט
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Background animated elements */}
      <MusicBackgroundAnimation />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <MusicLogo />

        {/* Login Form */}
        <LoginForm onLogin={handleLogin} onRegisterClick={goToRegister} />
      </div>
    </div>
  )
}
