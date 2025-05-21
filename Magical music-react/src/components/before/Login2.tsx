import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [message, setMessage] = useState('');

    const handleLogin = async (e:any) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7157/api/auth/login', {
                email,
                password,
            });

            if (response.data.token) {
                userDispatch({ type: 'LOGIN', payload: { email, token: response.data.token } });
                setMessage('התחברת בהצלחה');

                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else {
                setMessage('התחברות נכשלה, אנא בדוק את המייל והסיסמה.');
            }
        } catch (error) {
            setMessage('התחברות נכשלה, אנא נסה שוב או הירשם.');
        }
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
            <form className="login-form relative z-10 w-full max-w-md px-4" onSubmit={handleLogin}>
                {message && <p className="message">{message}</p>}
                <input
                    type="email"
                    placeholder="מייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className='login-buttons'>
                    <button className='header-button' onClick={() => navigate('/register')}>עדיין אין לי חשבון</button>
                    <button type="submit">כניסה</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
