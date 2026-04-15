import { useState, useEffect } from "react";
import { createUserFromEmployee } from "../services/authService";
import { getEmployees } from "../services/employeeService";

// pick an employee without a login and create a temporary user for them
function AssignUserForm({ onSuccess }) {
    // list of employees from the API
    const [employees, setEmployees] = useState([]);
    // formData holds the selected employee email and the credentials to create
    const [formData, setFormData] = useState({
        employeeEmail: "",
        username: "",
        password: "",
    });

    // message used to show simple success/error feedback to the user
    const [message, setMessage] = useState(null);

    // on mount: load employees
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const data = await getEmployees();
        setEmployees(data);
    };

    // When user selects an employee from the dropdown, auto-fill username/password
    // Username defaults to the employee email; temporary password defaults to DOB without dashes
    const handleEmployeeChange = (e) => {
        const employeeEmail = e.target.value;
        const emp = employees.find((employee) => employee.email === employeeEmail);

        setFormData({
            employeeEmail: employeeEmail,
            username: emp?.email || "",
            password: emp?.dateOfBirth ? emp.dateOfBirth.replaceAll("-", "") : "",
        });

        // clear any previous message when changing selection
        setMessage(null);
    };

    // Generic input handler— keeps formData keys in sync with input `name` attributes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Submit- call API to create user, show a message, reset form, refresh list
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createUserFromEmployee(formData);

            setMessage({
                type: "success",
                text: "User account created successfully",
            });

            // reset inputs after success
            setFormData({
                employeeEmail: "",
                username: "",
                password: "",
            });

            if (onSuccess) onSuccess();
            // reload employees to remove those who now have a login
            fetchEmployees();
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.detail || "Failed to create user",
            });
        }
    };

    return (
        <div className="card">
            <h3>Assign Login to Employee</h3>

            {message && <div className={`alert ${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    {/* show only employees who don't have logins yet */}
                    <select name="employeeEmail" value={formData.employeeEmail} onChange={handleEmployeeChange}>
                        <option value="">Select Employee</option>

                        {employees
                            .filter((emp) => !emp.hasLogin) // only show employees without login
                            .map((emp) => (
                                <option key={emp.email} value={emp.email}>
                                    {emp.firstName} {emp.lastName}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="form-row">
                    {/* editable username and temp password — user can tweak before submitting */}
                    <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                    <input name="password" placeholder="Temporary Password" value={formData.password} onChange={handleChange} />
                </div>

                <div className="form-row">
                    {/* submit to create the login */}
                    <button type="submit">Assign Login</button>
                </div>
            </form>
        </div>
    );
}

export default AssignUserForm;
