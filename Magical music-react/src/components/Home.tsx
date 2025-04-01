import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="in">
        <div className="container">
            <div className="bigTitle">
             
            <h1 className="home-title">קסם של צלילים</h1>
            <h2>אלפי שירים מחכים לכם, מה תרצו לשמוע?</h2>
            </div>
            <button id="start" className="header-button" onClick={() => navigate('/login')}>לכניסה</button>
        </div>
        </div>
    );
};

export default Home;
