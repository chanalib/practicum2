"use client"

import { useNavigate } from 'react-router-dom'; // עדכון כאן
import { MusicBackgroundAnimation } from "../../components/music-background-animation"
import { MusicLogo } from "../../components/music-logo"
import { RegisterForm } from "../../components/register-form"

export default function Register() {
  const navigate = useNavigate(); // עדכון כאן

  const handleRegister = (name: string, email: string, password: string) => {
    // In a real app, you would send the registration data to a backend
    // For demo purposes, we'll just navigate to the home page

    // Simulate storing user data (in a real app this would be done on the server)
    localStorage.setItem("user", JSON.stringify({ name, email }))

    // Navigate to home page
    navigate("/home"); // שימוש נכון בניווט
  }

  const goToLogin = () => {
    navigate("/"); // שימוש נכון בניווט
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Background animated elements */}
      <MusicBackgroundAnimation />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <MusicLogo />

        {/* Registration Form */}
        <RegisterForm onRegister={handleRegister} onLoginClick={goToLogin} />
      </div>
    </div>
  )
}