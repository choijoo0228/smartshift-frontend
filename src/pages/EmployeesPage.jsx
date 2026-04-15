import { useEffect, useState } from "react";
import { getEmployees, createEmployee } from "../services/employeeService";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import AssignUserForm from "../components/AssignUserForm";

// page to add employees, view the list, and assign user logins.
function EmployeesPage() {
    // employees loaded from the API
    const [employees, setEmployees] = useState([]);
    // simple message state for success/error alerts
    const [message, setMessage] = useState(null);

    // load employees from server
    const fetchEmployees = async () => {
        const data = await getEmployees();
        setEmployees(data);
    };

    // on mount, grab the employee list
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Handler for creating a new employee. Calls API, shows feedback, refreshes list.
    const handleAddEmployee = async (employee) => {
        try {
            await createEmployee(employee);

            setMessage({
                type: "success",
                text: "Employee added successfully"
            });

            // hide message after a bit
            setTimeout(() => setMessage(null), 3000);

            // refresh list to include the new employee
            fetchEmployees();
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to add employee"
            });
        }
        
    };

    return (
        <section className="page-section">
            <h2>Employees</h2>

            {/* quick feedback area */}
            {message && (
                <div className={`alert ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="card">
                <h3>Add Employee</h3>
                {/* form component is controlled and calls `onAddEmployee` on submit */}
                <EmployeeForm onAddEmployee={handleAddEmployee} />
            </div>

            <div className="card">
                <h3>Employee List</h3>
                {/* list component receives the employees array */}
                <EmployeeList employees={employees} />
            </div>  

            <div className="card">
                <h3>Assign User</h3>
                {/* small form to assign a login to an employee */}
                <AssignUserForm />
            </div>
        </section>
    );
}

export default EmployeesPage;