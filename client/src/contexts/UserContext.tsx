import React, { createContext, useEffect, useState } from 'react';
import { RegisterDataI, UserI } from '../Types/User';
import { registerService, fetchUserProfile } from "../services/authService"; // you'll need to implement this

interface AppContextValue {
    user: UserI | null;
    setUser: React.Dispatch<React.SetStateAction<UserI | null>>;
    isAuthorized: boolean;
    handleLoginContext: (token: string, userResponse: UserI) => void;
    handleLogoutContext: () => void;
    handleRegisterContext: (userResponse: UserI) => void;
}

export const AuthContext = createContext<AppContextValue>({
    user: null,
    isAuthorized: false,
    handleLoginContext: () => { },
    handleLogoutContext: () => { },
    handleRegisterContext: () => { },
    setUser: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [user, setUser] = useState<UserI | null>(null);

    const handleLoginContext = (token: string, user: UserI) => {
        setIsAuthorized(true);
        localStorage.setItem("token", token);
        setUser(user);
    };

    const handleRegisterContext = async (userData: RegisterDataI) => {
        try {
            const response = await registerService(userData);
            if (response?.data.token && response.data.updated) {
                setIsAuthorized(true);
                localStorage.setItem("token", response.data.token);
                setUser(response.data.updated);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogoutContext = () => {
        localStorage.removeItem("token");
        setIsAuthorized(false);
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthorized(true);
            (async () => {
                try {
                    const fetchedUser = await fetchUserProfile();
                    setUser(fetchedUser);
                } catch (err) {
                    console.error("Failed to fetch user profile:", err);
                    setIsAuthorized(false);
                    setUser(null);
                }
            })();
        } else {
            setIsAuthorized(false);
            setUser(null);
        }
    }, []);


    return (
        <AuthContext.Provider value={{ isAuthorized, user, setUser, handleLoginContext, handleLogoutContext, handleRegisterContext }}>
            {children}
        </AuthContext.Provider>
    );
};
