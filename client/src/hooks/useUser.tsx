import { useContext } from "react";
import { AuthContext } from "../contexts/UserContext";
import { UserI, SettingsI } from "../Types/User";
import { editProfileService } from "../services/authService";


export const useUser = () => {
    const { user, setUser, editUserContext } = useContext(AuthContext);


    // Save full or partial user updates
    const updateUser = async (updatedFields: Partial<UserI>) => {
        if (!user) return;

        try {
            const payload = {
                _id: user._id,
                ...updatedFields,
            };

            const response = await editProfileService(payload, setUser);

            if (response?.data?.user) {
                setUser(response.data.user);
                editUserContext(response.data.user);
                localStorage.setItem("userData", JSON.stringify(response.data.user));
            }
        } catch (err) {
            console.error("Error updating user profile:", err);
        }
    };

    // Update just the settings sub-object
    const updateSettings = async (newSettings: SettingsI) => {
        if (!user) return;

  /*       const updatedUser: UserI = {
            ...user,
            settings: newSettings,
        }; */

        await updateUser({ settings: newSettings });
        localStorage.setItem("settings", JSON.stringify(newSettings));
    };

    return {
        user,
        updateUser,
        updateSettings,
    };
};
