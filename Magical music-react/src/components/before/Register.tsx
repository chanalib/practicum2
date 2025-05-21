import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserProvider';

const Register = () => {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    if (!userContext) {
        throw new Error("UserContext must be used within a UserProvider");
    }

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7157/api/auth/register', {
                name,
                email,
                password,
            });
            if (response.data && response.data.message === 'נרשמת בהצלחה!') {
                setMessage('!נרשמת בהצלחה');
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } else {
                setMessage(response.data.message || 'שגיאה בהרשמה, אנא נסה שוב.');
            }
        } catch (error: any) {
            setMessage('שגיאה בהרשמה, אנא נסה שוב.');
        }
    };

    return (
        <div className="music-login-form">
            <div className="music-login-header">
                <h2>Magical Music</h2>
                <p>עולם של מוזיקה קסומה</p>
            </div>
            {message && <p className="error-message">{message}</p>}
            <form className="login-form" onSubmit={handleRegister}>
                <input
                    type="text"
                    id="name"
                    placeholder="שם"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="email"
                    id="email"
                    placeholder="מייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                    placeholder="סיסמה"

                />
                <div className="login-buttons">
                    <button type="submit" className="music-button">הרשמה</button>
                    <p className="register-link" onClick={() => navigate('/login')}>
                        כבר יש לי חשבון
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;
