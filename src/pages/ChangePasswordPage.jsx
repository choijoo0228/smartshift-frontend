import { useState } from "react";
import { changePassword } from "../services/authService";

function ChangePasswordPage({ user, onPasswordChanged }) {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validatePassword = () => {
        const password = formData.newPassword;

        if (!password || !formData.confirmPassword) {
            return "Please fill in both password fields";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }

        if (password.length > 20) {
            return "Password must not exceed 20 characters";
        }

        if (password !== formData.confirmPassword) {
            return "Passwords do not match";
        }

        return null;
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validatePassword();
        if (validationError) {
            setMessage({
                type: "error",
                text: validationError,
            });
            return;
        }

        try {
            await changePassword({
                userId: user.id,
                newPassword: formData.newPassword,
            });

            const updatedUser = { ...user, firstLogin: false };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            setMessage({
                type: "success",
                text: "Password updated successfully",
            });

            // small delay before redirect
            setTimeout(() => {
                onPasswordChanged(updatedUser);
            }, 1000);

        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.detail || "Failed to change password",
            });
        }
    };

    return (
        <div className="app-container">
            `<div className="card" style={{ maxWidth: "400px", margin: "60px auto" }}>
                <h2>Change Password</h2>

                {message && (
                    <div className={`alert ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="password" name="newPassword" placeholder="New Password" value={formData.newPassword} onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword}onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <button type="submit" disabled={!formData.newPassword || !formData.confirmPassword}>
                            Update Password
                        </button>
                    </div>
                </form>
            </div>`
        </div>
    );
}

export default ChangePasswordPage;