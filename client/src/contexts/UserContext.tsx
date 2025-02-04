import React, { createContext, useEffect, useState } from 'react';
import { UserI } from '../Types/User';


interface AppContextValue {
    user: UserI | null;
    setUser: React.Dispatch<React.SetStateAction<UserI | null>>;
    isAuthorized: boolean;
    handleLogin: (token: string, userResponse: UserI) => void;
    handleLogout: () => void;

/*     tripHistory: SummaryI[] | null;
    setTripHistory: React.Dispatch<React.SetStateAction<SummaryI[] | null>>;
    settings: SettingsI | null;
    setSettings: React.Dispatch<React.SetStateAction<SettingsI>>; */

}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AppContextValue>({
    isAuthorized: false,
    handleLogin: () => { },
    handleLogout: () => { },
    user: null,
    setUser: () => { },
/*     tripHistory: null,
    setTripHistory: () => {},
    settings: null,
    setSettings: () => {} */

});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(!!localStorage.getItem("token"));
    const [user, setUser] = useState<UserI | null>(null);

    const handleLogin = (token: string, userResponse: UserI) => {
        setIsAuthorized(true);
        const thisUser = userResponse;



        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userResponse));
        setUser(thisUser);

    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setIsAuthorized(false);
        setUser(null);
    };


    useEffect(() => {
        const decoded = localStorage.getItem('token');
        setIsAuthorized(!!decoded);
        if (decoded) {
            const storedUserData = localStorage.getItem("userData");
            setUser(storedUserData ? JSON.parse(storedUserData): null);
        } else {

            setUser(null);
        }
    }, []);


    return (
        <AuthContext.Provider value={{ isAuthorized, user, setUser,  handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
/*

/*   const userHistory: HistoryI[] | undefined = res.history;
  if (userHistory !== undefined) {
      const todayHistory: HistoryI = userHistory.filter(h => h.daylist_id === date)[0];
      if (todayHistory && todayHistory.guessedWords) {
          // todayHistory.guessedWords is likely an array of objects, which may or may not match your WordObj type
          // Adjust as necessary to match your expected structure.
          setGuessedWords(todayHistory.guessedWords);
      }
  } */