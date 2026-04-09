import { useState, useEffect } from "react";
import { createUserFromEmployee } from "../services/authService";
import { getEmployees } from "../services/employeeService";

function AssignUserForm({ onSuccess }) {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        employeeEmail: "",
        username: "",
        password: "",
    });

    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const data = await getEmployees();
        setEmployees(data);
    };

    //When selecting employee
    const handleEmployeeChange = (e) => {
        const employeeEmail = e.target.value;
        const emp = employees.find((employee) => employee.email === employeeEmail);

        setFormData({
            employeeEmail: employeeEmail,
            username: emp?.email || "",
            password: emp?.dateOfBirth ? emp.dateOfBirth.replaceAll("-", "") : "",
        });

        setMessage(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createUserFromEmployee(formData);

            setMessage({
                type: "success",
                text: "User account created successfully",
            });

            setFormData({
                employeeEmail: "",
                username: "",
                password: "",
            });

            if (onSuccess) onSuccess();
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
                    <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                    <input name="password" placeholder="Temporary Password" value={formData.password} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <button type="submit">Assign Login</button>
                </div>
            </form>
        </div>
    );
}

export default AssignUserForm;
