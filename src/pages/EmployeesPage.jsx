import { useEffect, useState } from "react";
import { getEmployees, createEmployee } from "../services/employeeService";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import AssignUserForm from "../components/AssignUserForm";

function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [message, setMessage] = useState(null);

    const fetchEmployees = async () => {
        const data = await getEmployees();
        setEmployees(data);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddEmployee = async (employee) => {
        try {
            await createEmployee(employee);

            setMessage({
                type: "success",
                text: "Employee added successfully"
            });

            setTimeout(() => setMessage(null), 3000);

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

            {/* Message Alert */}
            {message && (
                <div className={`alert ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="card">
                <h3>Add Employee</h3>
                <EmployeeForm onAddEmployee={handleAddEmployee} />
            </div>

            <div className="card">
                <h3>Employee List</h3>
                <EmployeeList employees={employees} />
            </div>  

            <div className="card">
                <h3>Assign User</h3>
                <AssignUserForm />
            </div>
        </section>
    );
}

export default EmployeesPage;