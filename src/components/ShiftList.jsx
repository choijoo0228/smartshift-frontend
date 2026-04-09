function ShiftList({ shifts, onEditShift, onDeleteShift }) {
    const sortedShifts = [...shifts].sort((a, b) => {
        const dateCompare = a.shiftDate.localeCompare(b.shiftDate);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
    });

    return (
        <table className="app-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Role</th>
                    <th>Employee</th>
                    <th>Published</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {sortedShifts.map((shift) => (
                    <tr key={shift.id}>
                        <td>{shift.shiftDate}</td>
                        <td>{shift.startTime?.slice(0, 5)}</td>
                        <td>{shift.endTime?.slice(0, 5)}</td>
                        <td>{shift.roleRequired}</td>
                        <td>{shift.assignedEmployee ? `${shift.assignedEmployee.firstName} ${shift.assignedEmployee.lastName}` : "Unassigned"}</td>
                        <td>{shift.published ? "Yes" : "No"}</td>
                        <td>
                            <button onClick={() => onEditShift(shift)} style={{ marginRight: "8px" }}>
                                Edit
                            </button>
                            <button onClick={() => onDeleteShift(shift.id)} style={{ backgroundColor: "#dc2626" }}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ShiftList;
