import { useEffect, useState } from "react";

// pick date/time, required role, and who to assign. Supports editing too.
function ShiftForm({ employees, onSaveShift, editingShift, onCancelEdit }) {
    // Controlled form state. Keep `name` attributes in inputs in sync with these keys.
    const [formData, setFormData] = useState({
        shiftDate: "",
        startTime: "",
        endTime: "",
        roleRequired: "EMPLOYEE",
        assignedEmployeeId: "",
    });

    // If we're editing an existing shift, populate the form from `editingShift`.
    useEffect(() => {
        if (editingShift) {
            setFormData({
                shiftDate: editingShift.shiftDate || "",
                // incoming times might include seconds; slice to HH:MM
                startTime: editingShift.startTime?.slice(0, 5) || "",
                endTime: editingShift.endTime?.slice(0, 5) || "",
                roleRequired: editingShift.roleRequired || "EMPLOYEE",
                // assignedEmployee.id may be string or number; normalize to int or empty
                assignedEmployeeId: editingShift.assignedEmployee?.id ? parseInt(editingShift.assignedEmployee.id) : "",
            });
        } else {
            // reset to blank when not editing
            setFormData({
                shiftDate: "",
                startTime: "",
                endTime: "",
                roleRequired: "EMPLOYEE",
                assignedEmployeeId: "",
            });
        }
    }, [editingShift]);

    // Debug-friendly change handler: logs the change and updates the matching key.
    const handleChange = (e) => {
        console.log("name:", e.target.name, "value:", e.target.value);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Submit: basic validation, build payload, call parent save.
    const handleSubmit = (e) => {
        e.preventDefault();

        // simple client-side guard — you probably want better UX later
        if (!formData.assignedEmployeeId) {
            alert("Please select an employee");
            return;
        }

        const payload = {
            shiftDate: formData.shiftDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            roleRequired: formData.roleRequired,
            // API expects an object with `id` when assigning an employee
            assignedEmployee: formData.assignedEmployeeId ? { id: parseInt(formData.assignedEmployeeId, 10) } : null,
        };

        console.log("shift payload:", payload);

        onSaveShift(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <input type="date" name="shiftDate" value={formData.shiftDate} onChange={handleChange} />
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
            </div>

            <div className="form-row">
                <select name="roleRequired" value={formData.roleRequired} onChange={handleChange}>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>

                {/* pick an employee to assign. value is the employee id */}
                <select name="assignedEmployeeId" value={formData.assignedEmployeeId} onChange={handleChange}>
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-row">
                <button type="submit">{editingShift ? "Update Shift" : "Add Shift"}</button>

                {editingShift && (
                    <button type="button" onClick={onCancelEdit} style={{ backgroundColor: "#6b7280" }}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default ShiftForm;
