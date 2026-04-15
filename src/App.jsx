import { useState } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import "./index.css";

// decides whether to show login, password-change flow, or the main dashboard.
function App() {
  // load user from localStorage so sessions persist on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // parent handler passed to LoginPage — receives the user object after login
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  // when password change completes, update local state (and localStorage is updated in that flow)
  const handlePasswordChanged = (updatedUser) => {
    setUser(updatedUser);
  };

  // logout: clear user from state and localStorage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  }

  // If not logged in, show the LoginPage
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // If first login flag present, force password change flow
  if (user.firstLogin) {
    return (
      <ChangePasswordPage user={user} onPasswordChanged={handlePasswordChanged} />
    );
  }

  // Normal app — show navbar and dashboard
  return (
    <>
      <Navbar />
      <Dashboard user={user} onLogout={handleLogout} />
    </>
  );
}

export default App;