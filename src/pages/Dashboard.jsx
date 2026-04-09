import { useState } from "react";
import EmployeesPage from "./EmployeesPage";
import ShiftsPage from "./ShiftsPage";
import WeeklyRosterPage from "./WeeklyRosterPage";

function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState(
    user.role === "EMPLOYEE" ? "roster" : "employees"
  );

  const renderPage = () => {
    if (activePage === "employees" && user.role === "ADMIN") {
      return <EmployeesPage />;
    }

    if (activePage === "shifts" && (user.role === "ADMIN" || user.role === "MANAGER")) {
      return <ShiftsPage />;
    }

    if (activePage === "roster") {
      return <WeeklyRosterPage user={user} />;
    }

    return <div className="card">Access denied</div>;
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h3>Dashboard</h3>
        <p className="sidebar-user">
          {user.username} ({user.role})
        </p>

        {user.role === "ADMIN" && (
          <button className="menu-button" onClick={() => setActivePage("employees")}>
            Employees
          </button>
        )}

        {(user.role === "ADMIN" || user.role === "MANAGER") && (
          <button className="menu-button" onClick={() => setActivePage("shifts")}>
            Shifts
          </button>
        )}

        <button className="menu-button" onClick={() => setActivePage("roster")}>
          Weekly Roster
        </button>

        <button className="menu-button logout-button" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default Dashboard;