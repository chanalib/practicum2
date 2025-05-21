import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/before/UserProvider';
import MusicAnimation from './components/before/MusicAnimation';
import Login from './components/before/Login';
import Register from './components/before/Register';
import Home from './components/before/Home';
import AllSongs from './components/before/AllSongs';
import Creators from './components/before/Creators';
import Songs from './components/before/Songs';
const App = () => {
    
  return (

      <UserProvider>
          <Router>
              <MusicAnimation /> {/* הקנבס מוצג קודם כך שהוא יהיה הרקע */}
              <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/register" element={<Register/>} />
                  <Route path="/home" element={<Home />} />

                    <Route path="/songs" element={<AllSongs />} />
                  <Route path="/creators" element={<Creators />} />
                  <Route path="/songs/:creatorId" element={<Songs />} />
              </Routes>
          </Router>
      </UserProvider>
   
  );
};

export default App;
