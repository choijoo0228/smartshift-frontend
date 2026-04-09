import { useState } from "react";
import { loginUser } from "../services/authService";

function LoginPage({ onLogin }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await loginUser(formData);
            localStorage.setItem("user", JSON.stringify(user));
            if (user.firstLogin) {
                onLogin({ ...user, requirePasswordChange: true });
            } else {
                onLogin(user);
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Login failed",
            });
        }
    };

    return (
        <div className="app-container">
            <div className="card" style={{ maxWidth: "400px", margin: "60px auto" }}>
                <h2>Login</h2>

                {/* Message Alert */}
                {message && <div className={`alert ${message.type}`}>{message.text}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
