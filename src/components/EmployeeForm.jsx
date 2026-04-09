import { useState } from "react";

function EmployeeForm({ onAddEmployee }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        role: "EMPLOYEE",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddEmployee(formData);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            dateOfBirth: "",
            role: "EMPLOYEE",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            </div>
            <div className="form-row">
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" />
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
            </div>
            <div className="form-row">
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="Date of Birth" />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="ADMIN">Admin</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                </select>
            </div>
            <div className="form-row">
                <button type="submit">Add Employee</button>
            </div>
        </form>
    );
}

export default EmployeeForm;
