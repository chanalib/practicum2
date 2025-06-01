import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
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
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsSuccess(false);
        try {
            const response = await axios.post('https://magical-music-server.onrender.com/auth/register', {
                name,
                email,
                password,
            });
            if (response.data && response.data.message === 'נרשמת בהצלחה!') {
                setIsSuccess(true);
                setName('');
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            } else {
                setError(response.data.message || 'שגיאה בהרשמה, אנא נסה שוב.');
            }
        } catch {
            setError('שגיאה בהרשמה, אנא נסה שוב.');
        }
    };

    return (
        <div className="music-login-form">
            <div className="music-login-header">
                <h2>Magical Music</h2>
                <p>עולם של מוזיקה קסומה</p>
            </div>
            {error && <p className="error-message">{error}</p>}
            <form className="login-form" onSubmit={handleRegister}>
                <input
                    type="text"
                    id="name"
                    placeholder="שם"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field"
                    disabled={isSuccess}
                />
                <input
                    type="email"
                    id="email"
                    placeholder="מייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                    disabled={isSuccess}
                />
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                    placeholder="סיסמה"
                    disabled={isSuccess}
                />
                <div className="login-buttons">
                    {!isSuccess ? (
                        <button type="submit" className="music-button">הרשמה</button>
                    ) : (
                        <button type="button" className="success-button" disabled>
                            נרשמת בהצלחה!
                        </button>
                    )}
                    <p className="register-link" onClick={() => !isSuccess && navigate('/login')}>
                        כבר יש לי חשבון
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;
