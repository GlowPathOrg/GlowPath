import React, { createContext,  useEffect,  useState } from 'react';
import { RegisterDataI, UserI } from '../Types/User';
import { registerService } from "../services/authService";
import useLocalStorage from '../hooks/useLocalStorage';

interface AppContextValue {
    user: UserI | null;
    setUser: React.Dispatch<React.SetStateAction<UserI | null>>;
    isAuthorized: boolean;
    handleLoginContext: (token: string, userResponse: UserI) => void;
    handleLogoutContext: () => void;
    editUserContext: (updatedUser: UserI) => void;
    handleRegisterContext: (userResponse: UserI) => void;



/*     tripHistory: SummaryI[] | null;
    setTripHistory: React.Dispatch<React.SetStateAction<SummaryI[] | null>>;
    settings: SettingsI | null;
    setSettings: React.Dispatch<React.SetStateAction<SettingsI>>; */

}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AppContextValue>({
    user: null,
    isAuthorized: false,
    handleLoginContext: () => { },
    handleLogoutContext: () => { },
    handleRegisterContext: () => {},
    editUserContext: () => {},
    setUser: () => { },
/*     tripHistory: null,
    setTripHistory: () => {},
    settings: null,
    setSettings: () => {} */

});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(!!localStorage.getItem("token"));
    const [user, setUser] = useLocalStorage<UserI | null>("userData", null);

    const handleLoginContext = (token: string, user: UserI) => {


                setIsAuthorized(true);
                localStorage.setItem("token", token);
                localStorage.setItem("userData", JSON.stringify(user));
                setUser(user);






    };
    const handleRegisterContext = async (userData: RegisterDataI) => {
        try {
            const response = await registerService(userData);
            console.log(response);
            if (response?.data.token && response.data.updated) {
                setIsAuthorized(true);
                const thisUser = response.data.updated;
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userData", JSON.stringify(thisUser));
                setUser(thisUser);
            }
        }
        catch (error) {
            console.log(error);
        }



    };

    const handleLogoutContext = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setIsAuthorized(false);
        setUser(null);
    };

    const editUserContext = (updatedUser: UserI) => {
        setUser(updatedUser);
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
    }, [setUser, user]);


    return (
        <AuthContext.Provider value={{ isAuthorized, user, setUser,  handleLoginContext, handleLogoutContext, handleRegisterContext, editUserContext }}>
            {children}
        </AuthContext.Provider>
    );
};
