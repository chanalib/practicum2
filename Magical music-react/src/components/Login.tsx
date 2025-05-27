import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "./music-forms.css";
import React from 'react';
import { UserContext } from './UserProvider';

const Login = () => {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    if (!userContext) {
        throw new Error("UserContext must be used within a UserProvider");
    }

    const { userDispatch } = userContext;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsSuccess(false);
        try {
            const response = await axios.post('https://localhost:7157/api/auth/login', { email, password });

            if (response.data.token) {
                const user = { email, token: response.data.token };
                localStorage.setItem('user', JSON.stringify(user));
                userDispatch({ type: 'LOGIN', payload: user });

                setIsSuccess(true);
                setEmail('');
                setPassword('');

                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            } else {
                setError('התחברות נכשלה, אנא בדוק את המייל והסיסמה.');
            }
        } catch {
            setError('התחברות נכשלה, אנא נסה שוב או הירשם.');
        }
    };

    return (
        <div className="music-login-form">
            <div className="music-login-header">
                <h2>Magical Music</h2>
                <p>עולם של מוזיקה קסומה</p>
            </div>
            <form className="login-form" onSubmit={handleLogin}>
                <label htmlFor="email">דואר אלקטרוני</label>
                <input
                    type="email"
                    id="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                    disabled={isSuccess}
                />
                <label htmlFor="password">סיסמה</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                    disabled={isSuccess}
                />

                {error && <p className="error-message">{error}</p>}

                <div className="login-buttons">
                    {!isSuccess ? (
                        <button type="submit" className="music-button">כניסה</button>
                    ) : (
                        <button type="button" className="success-button" disabled>
                            התחברת בהצלחה!
                        </button>
                    )}
                    <p className="register-link" onClick={() => !isSuccess && navigate('/register')}>
                        עדיין אין לי חשבון
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
