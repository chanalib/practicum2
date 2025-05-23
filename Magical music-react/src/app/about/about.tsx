import { MusicBackgroundAnimation } from "../../components/music-background-animation";
import { MusicHeader } from "../../components/before/music-header";
import { useNavigate } from "react-router-dom"; 

export default function AboutPage() {
  const navigate = useNavigate(); // עדכון כאן

  const handleLogout = () => {
    navigate("/"); // עדכון כאן
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background animated elements */}
      <MusicBackgroundAnimation />

      {/* Header */}
      <MusicHeader onLogout={handleLogout} />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 pt-32 pb-12">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text text-center">
          אודות
        </h1>
        <p className="text-gray-300 text-center mb-8">מידע על Magical Music</p>

        {/* Placeholder content */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">תוכן עמוד האודות יופיע כאן</p>
        </div>
      </main>
    </div>
  );
}
