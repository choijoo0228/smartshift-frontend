import { useState } from "react";
import EmployeesPage from "./EmployeesPage";
import ShiftsPage from "./ShiftsPage";
import WeeklyRosterPage from "./WeeklyRosterPage";

// top-level layout with a sidebar menu. Pages shown depend on user role.
function Dashboard({ user, onLogout }) {
  // default active page depends on role (employees for admins/managers, roster for employees)
  const [activePage, setActivePage] = useState(
    user.role === "EMPLOYEE" ? "roster" : "employees"
  );

  // Decide which page to render based on `activePage` and the user's role/permissions.
  const renderPage = () => {
    // Admins can see the employees list
    if (activePage === "employees" && user.role === "ADMIN") {
      return <EmployeesPage />;
    }

    // Admins and managers can see shift management
    if (activePage === "shifts" && (user.role === "ADMIN" || user.role === "MANAGER")) {
      return <ShiftsPage />;
    }

    // Everyone (including employees) can see their weekly roster
    if (activePage === "roster") {
      return <WeeklyRosterPage user={user} />;
    }

    // fallback for anything unexpected
    return <div className="card">Access denied</div>;
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h3>Dashboard</h3>
        {/* show who is logged in */}
        <p className="sidebar-user">
          {user.username} ({user.role})
        </p>

        {/* Admin-only menu entry */}
        {user.role === "ADMIN" && (
          <button className="menu-button" onClick={() => setActivePage("employees")}>
            Employees
          </button>
        )}

        {/* Admins and managers see the Shifts button */}
        {(user.role === "ADMIN" || user.role === "MANAGER") && (
          <button className="menu-button" onClick={() => setActivePage("shifts")}>
            Shifts
          </button>
        )}

        {/* Everyone can open the roster view */}
        <button className="menu-button" onClick={() => setActivePage("roster")}>
          Weekly Roster
        </button>

        <button className="menu-button logout-button" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        {/* render the chosen page */}
        {renderPage()}
      </main>
    </div>
  );
}

export default Dashboard;