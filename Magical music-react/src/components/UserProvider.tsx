import React, { createContext, Dispatch, useReducer, ReactNode } from 'react';

// הגדרת טיפוס למצב המשתמש
export type User = {
    email: string;
    token: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    phone?: string;
};

export type UserContextType = {
    user: User | null;
    isLogin: boolean; // הוספת שדה isLogin
    userDispatch: Dispatch<UserAction>;
};

// הגדרת טיפוס לפעולות
export type UserAction = 
    | { type: 'LOGIN'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'REGISTER' }
    | { type: 'SHOW_MESSAGE'; payload: string };

// יצירת הקונטקסט
export const UserContext = createContext<UserContextType | null>(null);

// דוגמה לפעולות שניתן לבצע על המשתמש
const userReducer = (state: UserContextType, action: UserAction): UserContextType => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, isLogin: true }; // עדכון isLogin ל-true
        case 'LOGOUT':
            return { ...state, user: null, isLogin: false }; // עדכון isLogin ל-false
        default:
            return state;
    }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const initialState: UserContextType = { user: null, isLogin: false, userDispatch: () => {} }; // ערך התחלתי
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{ user: state.user, isLogin: state.isLogin, userDispatch: dispatch }}>
            {children}
        </UserContext.Provider>
    );
};
