import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { UserContext, UserProvider } from './components/UserProvider';
import MusicAnimation from './components/MusicAnimation';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AllSongs from './components/AllSongs';
import Creators from './components/Creators';
import { MusicHeader } from './components/MusicHeader';
import AudioRecorder from './components/AudioRecorder';
import KaraokeRecorder from './components/KaraokeRecorder';
import { useContext } from 'react';
import TranscriptionPage from './components/TranscriptionPage';
import ContactForm from './components/Messages';
import CreatorSongs from './components/CreatorSongs';
const AppContent = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  if (!userContext) return null;

  const { userDispatch, isLogin } = userContext;

  const handleLogout = () => {
    localStorage.removeItem('token');
    userDispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <>
      <MusicAnimation />
      <MusicHeader onLogout={handleLogout} user={userContext.user} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isLogin ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/songs" element={isLogin ? <AllSongs /> : <Navigate to="/login" replace />} />
          <Route path="/creators" element={isLogin ? <Creators /> : <Navigate to="/login" replace />} />
          <Route path="/creator/:id" element={isLogin ? <CreatorSongs /> : <Navigate to="/login" replace />} />
          <Route path="/songs/:creatorId" element={isLogin ? <AllSongs /> : <Navigate to="/login" replace />} />
          <Route path="/AudioRecorder" element={isLogin ? <AudioRecorder /> : <Navigate to="/login" replace />} />
          <Route path="/Transcription" element={isLogin ? <TranscriptionPage /> : <Navigate to="/login" replace />} />
          <Route path="/KaraokeRecorder" element={isLogin ? <KaraokeRecorder /> : <Navigate to="/login" replace />} />
          <Route path="/request" element={isLogin ? <ContactForm /> : <Navigate to="/login" replace />} />

        </Routes>
      </main>
    </>
  );
};


const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;
