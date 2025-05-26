import { useContext } from "react";
import { AuthContext } from "../contexts/UserContext";
import { UserI } from "../Types/User";
import { editProfileService } from "../services/authService";


export const useUser = () => {
    const { user, setUser } = useContext(AuthContext);
    const updateUser = async (updatedFields: Partial<UserI>) => {
        if (!user) return;

        try {
            const payload = {
                _id: user._id,
                ...updatedFields,
            };

            await editProfileService(payload, setUser);
            console.log(`[hook, updateUser]: firstname is ${user.firstName}`)

        } catch (err) {
            console.error("Error updating user profile:", err);
        }
    };



    return {
        user,
        updateUser
    };
};
