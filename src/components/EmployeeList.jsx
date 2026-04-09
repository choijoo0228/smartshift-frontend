function EmployeeList({ employees }) {
    return (
        <table className="app-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date of Birth</th>
                    <th>Role</th>
                    <th>Login Status</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((emp) => (
                    <tr key={emp.email}>
                        <td>
                            {emp.firstName} {emp.lastName}
                        </td>
                        <td>{emp.email}</td>
                        <td>{emp.phoneNumber}</td>
                        <td>{emp.dateOfBirth || "-"}</td>
                        <td>{emp.role}</td>
                        <td>{emp.loginStatus === "Y" ? "Yes" : "No"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default EmployeeList;
