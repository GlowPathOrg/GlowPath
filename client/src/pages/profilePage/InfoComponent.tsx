import React, { useContext, useEffect, useState } from "react";
import "../../styles/InfoComponent.css";
import { AuthContext } from "../../contexts/UserContext";
import { editProfileService } from "../../services/authService";

const InfoComponent: React.FC = () => {
    const { user, setUser, editUserContext} = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
   const [reenteredPassword, setReenteredPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [fieldBeingEdited, setFieldBeingEdited] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        password: user?.password || "",
        telephone: user?.telephone || "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                password: user.password || "",
                telephone: user.telephone || "",
            });
        }
    }, [user]);

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSaveField = (fieldName: string) => {
        setFieldBeingEdited(fieldName);

        if (fieldName === "password") {
            // Show the modal only for password changes
            setShowModal(true);
        } else {
            // Directly submit data for other fields
            submitData(fieldName);
        }
    };

    const handleReenteredPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReenteredPassword(e.target.value);
    };

    const submitData = async (fieldName: string) => {

        if (!user) {
            console.log('no user');
            return};

        try {
            const payload: {
                [key in keyof typeof formData]?: string;
            } & { _id: string } = {
                [fieldName]: formData[fieldName as keyof typeof formData],
                _id: user._id,

            };

            if (fieldName === "password") {
                payload.password = reenteredPassword;
            }

            const response = await editProfileService(payload);
            console.log(response);
            if (response && response.data.updated) {
                editUserContext(response.data.updated)
                setUser(response.data.updated);
                console.log("Profile updated successfully!");
                setShowModal(false);
                setFieldBeingEdited(null);
                setEditMode(false);
                setErrorMessage('')
            }
            else {
                console.log('weird response', response)
            }

        } catch (error) {
            console.error("Error updating profile:", error);
            setErrorMessage("Failed to update profile. Please try again.");
        }

        setReenteredPassword("");
    };

    return (
        <div className="settings-comp">
            {!editMode ? (
                <>
                    <table className="info-table">
                        <tbody>
                            <tr>
                                <td><strong>First Name:</strong></td>
                                <td>{user && user.firstName}</td>
                            </tr>
                            <tr>
                                <td><strong>Last Name:</strong></td>
                                <td>{user && user.lastName}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{user && user.email}</td>
                            </tr>
                            <tr>
                                <td><strong>Password:</strong></td>
                                <td>{user && user.password}</td>
                            </tr>
                            <tr>
                                <td><strong>Phone:</strong></td>
                                <td>{user && user.telephone}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="edit-info-button" onClick={toggleEditMode}>
                        Edit Information
                    </button>
                </>
            ) : (
                <div className="info-form">
                    {/* First Name Field */}
                    <div className="form-group">
                        <label htmlFor="firstName"><strong>First Name:</strong></label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                        <button
                            className="save-info-button"
                            type="button"
                            onClick={() => handleSaveField("firstName")}
                        >
                            Save First Name
                        </button>
                    </div>

                    {/* Last Name Field */}
                    <div className="form-group">
                        <label htmlFor="lastName"><strong>Last Name:</strong></label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                        <button
                            className="save-info-button"
                            type="button"
                            onClick={() => handleSaveField("lastName")}
                        >
                            Save Last Name
                        </button>
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email"><strong>Email:</strong></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <button
                            className="save-info-button"
                            type="button"
                            onClick={() => handleSaveField("email")}
                        >
                            Save Email
                        </button>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <button
                            className="save-info-button"
                            type="button"
                            onClick={() => handleSaveField("password")}
                        >
                            Save Password
                        </button>
                    </div>

                    {/* Phone Field */}
                    <div className="form-group">
                        <label htmlFor="telephone"><strong>Phone:</strong></label>
                        <input
                            type="tel"
                            id="telephone"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleInputChange}
                        />
                        <button
                            className="save-info-button"
                            type="button"
                            onClick={() => handleSaveField("telephone")}
                        >
                            Save Phone
                        </button>
                    </div>
                        <button onClick={() => setEditMode(false)}>
                            Cancel
                        </button>
                </div>
            )}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Confirm Your Password</h3>
                        <p>Please re-enter your password to confirm changes:</p>
                        <input
                            type="password"
                            value={reenteredPassword}
                            onChange={handleReenteredPasswordChange}
                            placeholder="Re-enter password"
                        />
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        <button className="confirm-button" onClick={() => submitData(fieldBeingEdited!)}>
                            Confirm
                        </button>
                        <button className="cancel-button" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
           </div>
    );
};

export default InfoComponent;