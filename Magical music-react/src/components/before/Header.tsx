import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserProvider';

const Header = () => {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    const handleButtonClick = (path:any) => {
        if (!userContext?.isLogin) {
            alert('על מנת להיכנס למערכת יש להתחבר!');
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    return (
        <header className="header">
            <nav className="header-nav">
                <div className="header-buttons">
                    <button className="header-button" onClick={() => handleButtonClick('/login')}>התחבר</button> 
                    <button className="header-button" onClick={() => handleButtonClick('/songs')}>שירים</button>
                    <button className="header-button" onClick={() => handleButtonClick('/Creators')}>יוצרים</button>
                    <button className="header-button" onClick={() => handleButtonClick('/home')}>דף הבית</button> 
                </div>
            </nav>
        </header>
    );
};

export default Header;
