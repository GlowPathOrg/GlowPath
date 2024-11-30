import { useEffect, useState } from "react";
import { UserI } from "../Types/User";

export const useLoginStatus = () => {
    const [isAuthorized, setIsAuthorized] = useState(!!localStorage.getItem("token"));
    const [userData, setUserData] = useState<UserI | null>(null);

    const handleLogin = (token: string, userResponse: UserI) => {
        setIsAuthorized(true);
        const thisUser = userResponse;



        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userResponse));
        setUserData(thisUser);

    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setIsAuthorized(false);
        setUserData(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthorized(!!token);

        if (token) {
            const storedUserData = localStorage.getItem("userData");
            setUserData(storedUserData ? JSON.parse(storedUserData) : null);
        } else {
            setUserData(null);
        }
    }, []);

    return { isAuthorized, userData, handleLogout, handleLogin };
};
