import { useEffect, useState } from "react";

function ShiftForm({ employees, onSaveShift, editingShift, onCancelEdit }) {
    const [formData, setFormData] = useState({
        shiftDate: "",
        startTime: "",
        endTime: "",
        roleRequired: "EMPLOYEE",
        assignedEmployeeId: "",
    });

    useEffect(() => {
        if (editingShift) {
            setFormData({
                shiftDate: editingShift.shiftDate || "",
                startTime: editingShift.startTime?.slice(0, 5) || "",
                endTime: editingShift.endTime?.slice(0, 5) || "",
                roleRequired: editingShift.roleRequired || "EMPLOYEE",
                assignedEmployeeId: editingShift.assignedEmployee?.id ? parseInt(editingShift.assignedEmployee.id) : "",   
            });
        } else {
            setFormData({
                shiftDate: "",
                startTime: "",
                endTime: "",
                roleRequired: "EMPLOYEE",
                assignedEmployeeId: "",
            });
        }
    }, [editingShift]);

    const handleChange = (e) => {
        console.log("name:", e.target.name, "value:", e.target.value);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.assignedEmployeeId) {
            alert("Please select an employee");
            return;
            }

        const payload = {
            shiftDate: formData.shiftDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            roleRequired: formData.roleRequired,
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
