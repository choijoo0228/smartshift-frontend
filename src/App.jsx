import { useState } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import "./index.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handlePasswordChanged = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.firstLogin) {
    return (
      <ChangePasswordPage user={user} onPasswordChanged={handlePasswordChanged} />
    );
  }

  return (
    <>
      <Navbar />
      <Dashboard user={user} onLogout={handleLogout} />
    </>
  );
}

export default App;