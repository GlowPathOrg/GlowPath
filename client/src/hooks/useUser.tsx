import { useContext } from "react";
import { AuthContext } from "../contexts/UserContext";
import { UserI } from "../Types/User";
import { editProfileService, fetchUserProfile } from "../services/authService";


export const useUser = () => {
    const { user, setUser } = useContext(AuthContext);
    //console.log(`[user hook, line 9]: user is ${user?.settings.defaultSos}`)


    // Save full or partial user updates
    const updateUser = async (updatedFields: Partial<UserI>) => {
        if (!user) return;

        try {
            const payload = {
                _id: user._id,
                ...updatedFields,
            };

            await editProfileService(payload, setUser);
            const newUser: UserI = await fetchUserProfile()
            console.log(`[hook, updateUser]: firstname is ${user.firstName}`)

            if (newUser) {
            console.log(`[user hook, updateUser]: user default sos is now ${newUser.settings.defaultSos}`)
                setUser(newUser);
                console.log(`[hook...] user is ${newUser.firstName}`)
            }
        } catch (err) {
            console.error("Error updating user profile:", err);
        }
    };



    return {
        user,
        updateUser
    };
};
