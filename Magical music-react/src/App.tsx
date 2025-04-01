import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Creators from './components/Creators';
import AllSongs from './components/AllSongs';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';
import { UserProvider } from './components/UserProvider';
import Songs from './components/Songs';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/creators" element={<Creators />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/songs" element={<AllSongs />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/songs/:creatorId" element={<Songs />} />

                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
