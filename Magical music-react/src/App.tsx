import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/before/UserProvider';
import MusicAnimation from './components/before/MusicAnimation';
import Login from './components/before/Login';
import Register from './components/before/Register';
import Home from './components/before/Home';
import AllSongs from './components/before/AllSongs';
import Creators from './components/before/Creators';
import Songs from './components/before/Songs';
import { MusicHeader } from './components/music-header';
import AudioRecorder from './components/before/AudioRecorder';
import KaraokeRecorder from './components/before/KaraokeRecorder';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <MusicAnimation /> {/* רקע קנבס */}
        <MusicHeader onLogout={() => console.log('logout')} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/songs" element={<AllSongs />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/songs/:creatorId" element={<Songs />} />
            <Route path="/AudioRecorder" element={<AudioRecorder/>}/>
            <Route path="/KaraokeRecorder" element={<KaraokeRecorder/>}/>
          </Routes>
        </main>
      </Router>
    </UserProvider>
  );
};

export default App;
