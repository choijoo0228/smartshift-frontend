import { useState } from "react";
import { loginUser } from "../services/authService";

// simple login form. If user is flagged for firstLogin, parent will trigger password change flow.
function LoginPage({ onLogin }) {
    // controlled inputs for username/password
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    // message used for quick error display
    const [message, setMessage] = useState(null);

    // keep formData in sync with inputs (name -> state key)
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // call API, stash user in localStorage, and notify parent via onLogin
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await loginUser(formData);

            // save user locally so other parts of the app can read it
            localStorage.setItem("user", JSON.stringify(user));

            // if this is the first login, parent will route to password change flow
            if (user.firstLogin) {
                onLogin({ ...user, requirePasswordChange: true });
            } else {
                onLogin(user);
            }
        } catch (error) {
            // show an inline error message (not modal)
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

                {/* small inline alert area for errors */}
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
