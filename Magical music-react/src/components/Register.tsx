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
            const response = await axios.post('https://localhost:7058/api/auth/register', {
                name,
                email,
                password,
            });
            console.log('Full response:', response);
            if (response.data && response.data.message === 'נרשמת בהצלחה!') {
                setMessage('!נרשמת בהצלחה');
                console.log('Message set to: נרשמת בהצלחה!');
                setTimeout(() => {
                    console.log('Navigating to /login');    
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(response.data.message || 'שגיאה בהרשמה, אנא נסה שוב.');
            }
        } catch (error: any) {
            if (error.response) {
                console.error('Error details:', error.response.data);
                setMessage('שגיאה בהרשמה, אנא נסה שוב.');
            } else {
                console.error('Error:', error.message);
                setMessage('שגיאה בהרשמה, אנא נסה שוב.');
            }
        }
    };

    return (
        <div className="login-container">
            {message && <p className="message">{message}</p>}
            <form className="login-form" onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="שם"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                    <button className='header-button' onClick={() => navigate('/login')}>כבר יש לי חשבון</button>
                    <button type="submit">הרשמה</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
