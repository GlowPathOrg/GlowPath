import React, { useState } from 'react';
import '../../styles/InfoComponent.css';
import { useLoginStatus } from '../../hooks/userLogin';
import { editProfile } from '../../services/authService';

const InfoComponent: React.FC = () => {
    const { userData, handleLogin } = useLoginStatus();
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [reenteredPassword, setReenteredPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldBeingEdited, setFieldBeingEdited] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        password: userData?.password || '',
        telephone: userData?.telephone || '',
    });

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
        setShowModal(true);
    };

    const handleReenteredPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReenteredPassword(e.target.value);
    };

    const submitData = async () => {
        if (!fieldBeingEdited || !userData) return;


        try {
console.log('sending from component', fieldBeingEdited, userData)
            await editProfile({
                [fieldBeingEdited as keyof typeof formData]: formData[fieldBeingEdited as keyof typeof formData],
                password: reenteredPassword,
                _id: userData?._id
            }, handleLogin);

            console.log('Profile updated successfully!');
            setShowModal(false);
            setFieldBeingEdited(null);
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="settings-comp">
            {!editMode ? (
                <>
                    <table className="info-table">
                        <tbody>
                            <tr>
                                <td><strong>First Name:</strong></td>
                                <td>{userData && userData.firstName}</td>
                            </tr>
                            <tr>
                                <td><strong>Last Name:</strong></td>
                                <td>{userData && userData.lastName}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{userData && userData.email}</td>
                            </tr>
                            <tr>
                                <td><strong>Password:</strong></td>
                                <td>{userData && userData.password}</td>
                            </tr>
                            <tr>
                                <td><strong>Phone:</strong></td>
                                <td>{userData && userData.telephone}</td>
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
                            onClick={() => handleSaveField('firstName')}
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
                            onClick={() => handleSaveField('lastName')}
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
                            onClick={() => handleSaveField('email')}
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
                            onClick={() => handleSaveField('password')}
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
                            onClick={() => handleSaveField('telephone')}
                        >
                            Save Phone
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for password confirmation */}
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
                        <button className="confirm-button" onClick={submitData}>
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
