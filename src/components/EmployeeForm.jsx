import { useState } from "react";

// Small controlled form component used to collect employee details
// onAddEmployee function called with the form data when the form is submitted
function EmployeeForm({ onAddEmployee }) {
    // formData holds all input values for the form
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        role: "EMPLOYEE",
    });

    // Generic change handler: updates the single field that changed while preserving other values
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Submit handler: prevents default form submit, forwards the data to parent, then resets the form.
    const handleSubmit = (e) => {
        e.preventDefault();
        onAddEmployee(formData);
        // reset form to initial state after successful submit
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            dateOfBirth: "",
            role: "EMPLOYEE",
        });
    };

    // the jsx below renders inputs bound to formData
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
