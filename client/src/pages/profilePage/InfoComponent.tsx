import React, { useEffect, useState } from "react";
import "../../styles/InfoComponent.css";
import { useLoginStatus } from "../../hooks/userLogin";
import { editProfile } from "../../services/authService";

const InfoComponent: React.FC = () => {
  const { userData, handleLogin } = useLoginStatus();
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    password: "",
    telephone: userData?.telephone || "",
  });

  useEffect(() => {
    // Load user data from local storage or userData
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setFormData(JSON.parse(storedUserData));
    } else if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        password: "",
        telephone: userData.telephone || "",
      });
    }
  }, [userData]);

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

  const handleSaveField = async (fieldName: string) => {
    try {
      const payload = {
        [fieldName]: formData[fieldName as keyof typeof formData],
        _id: userData?._id || "",
      };

      // If editing password, show the modal
      if (fieldName === "password") {
        setShowModal(true);
        return;
      }

      const response = await editProfile(payload, handleLogin);
      if (response) {
        console.log("Profile updated successfully!");
        const updatedUserData = {
          ...formData,
          [fieldName]: formData[fieldName as keyof typeof formData],
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setFormData(updatedUserData);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  const handleReenteredPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReenteredPassword(e.target.value);
  };

  const submitPasswordChange = async () => {
    try {
      const payload = {
        password: reenteredPassword,
        _id: userData?._id || "",
      };

      const response = await editProfile(payload, handleLogin);
      if (response) {
        console.log("Password updated successfully!");
        localStorage.setItem("userData", JSON.stringify({ ...formData, password: "" }));
        setFormData({ ...formData, password: "" });
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("Failed to update password. Please try again.");
    }
    setReenteredPassword("");
  };

  const handleCancel = () => {
    // Reset form data to the original state
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setFormData(JSON.parse(storedUserData));
    }
    setEditMode(false);
  };

  return (
    <div className="settings-comp">
      {!editMode ? (
        <>
          <table className="info-table">
            <tbody>
              <tr>
                <td><strong>First Name:</strong></td>
                <td>{formData.firstName}</td>
              </tr>
              <tr>
                <td><strong>Last Name:</strong></td>
                <td>{formData.lastName}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{formData.email}</td>
              </tr>
              <tr>
                <td><strong>Phone:</strong></td>
                <td>{formData.telephone}</td>
              </tr>
            </tbody>
          </table>
          <button className="edit-info-button" onClick={toggleEditMode}>
            Edit Information
          </button>
        </>
      ) : (
        <div className="info-form">
          {["firstName", "lastName", "email", "telephone"].map((field) => (
            <div key={field} className="form-group">
              <label htmlFor={field}><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong></label>
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleInputChange}
              />
              <button onClick={() => handleSaveField(field)}>Save</button>
            </div>
          ))}
          <button className="cancel-button" onClick={handleCancel}>
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
            <button className="confirm-button" onClick={submitPasswordChange}>
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