import React, {
    createContext,
    Dispatch,
    useReducer,
    ReactNode
  } from 'react';
  
  // טיפוסים
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
    isLogin: boolean;
    isReady: boolean;
    userDispatch: Dispatch<UserAction>;
  };
  
  export type UserAction =
    | { type: 'LOGIN'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'REGISTER' }
    | { type: 'SHOW_MESSAGE'; payload: string };
  
  // יצירת קונטקסט
  export const UserContext = createContext<UserContextType | null>(null);
  
  // Reducer
  const userReducer = (state: UserContextType, action: UserAction): UserContextType => {
    switch (action.type) {
      case 'LOGIN':
        return { ...state, user: action.payload, isLogin: true };
      case 'LOGOUT':
        return { ...state, user: null, isLogin: false };
      default:
        return state;
    }
  };
  
  // אתחול דינמי מה־localStorage
  const initUserState = (): UserContextType => {
    const userJson = localStorage.getItem('user');
    const user: User | null = userJson ? JSON.parse(userJson) : null;
  
    return {
      user,
      isLogin: !!user,
      isReady: true,
      userDispatch: () => {}, // מתחלף אחר כך
    };
  };
  
  // Provider
  export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, undefined, initUserState);
  
    return (
      <UserContext.Provider
        value={{
          user: state.user,
          isLogin: state.isLogin,
          isReady: state.isReady,
          userDispatch: dispatch,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  };
  