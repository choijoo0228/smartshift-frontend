import { useEffect, useMemo, useState } from "react";
import { getWeeklyShifts, getPublishedWeeklyShifts } from "../services/shiftService";
import { getEmployees } from "../services/employeeService";

function WeeklyRosterPage({ user }) {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const getCurrentWeekRange = () => {
        const today = new Date();
        const day = today.getDay(); // Sun=0, Mon=1, ...
        const diffToMonday = day === 0 ? -6 : 1 - day;

        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return {
            start: monday.toISOString().split("T")[0],
            end: sunday.toISOString().split("T")[0],
        };
    };

    const initialWeek = getCurrentWeekRange();

    const [start, setStart] = useState(initialWeek.start);
    const [end, setEnd] = useState(initialWeek.end);
    const [rosterData, setRosterData] = useState([]);
    const [message, setMessage] = useState(null);

    const formatTime = (time) => {
        if (!time) return "";
        return time.slice(0, 5);
    };

    const formatDateKey = (dateString) => {
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return map[dayIndex];
    };

    const transformRosterData = (shifts, employees) => {
        const employeeMap = {};

        // Initialize map with all employees (so those without shifts show up)
        if (employees && Array.isArray(employees)) {
            employees.forEach((emp) => {
                const name = `${emp.firstName} ${emp.lastName}`;
                employeeMap[name] = {
                    employeeName: name,
                    Mon: "Off",
                    Tue: "Off",
                    Wed: "Off",
                    Thu: "Off",
                    Fri: "Off",
                    Sat: "Off",
                    Sun: "Off",
                };
            });
        }

        // Fill shifts; include an "Unassigned" row if needed
        shifts.forEach((shift) => {
            const employeeName = shift.assignedEmployee ? `${shift.assignedEmployee.firstName} ${shift.assignedEmployee.lastName}` : "Unassigned";

            if (!employeeMap[employeeName]) {
                employeeMap[employeeName] = {
                    employeeName,
                    Mon: "Off",
                    Tue: "Off",
                    Wed: "Off",
                    Thu: "Off",
                    Fri: "Off",
                    Sat: "Off",
                    Sun: "Off",
                };
            }

            const dayKey = formatDateKey(shift.shiftDate);
            const shiftText = `${formatTime(shift.startTime)} - ${formatTime(shift.endTime)}`;

            if (employeeMap[employeeName][dayKey] === "Off") {
                employeeMap[employeeName][dayKey] = shiftText;
            } else {
                employeeMap[employeeName][dayKey] += `, ${shiftText}`;
            }
        });

        return Object.values(employeeMap).sort((a, b) => a.employeeName.localeCompare(b.employeeName));
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const filteredRosterData = useMemo(() => {
        return rosterData;
    }, [rosterData]);

    const weekDateLabels = useMemo(() => {
        if (!start) return new Array(7).fill("");
        const startDate = new Date(start);
        const labels = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            labels.push(d.toLocaleDateString(undefined, { month: "short", day: "numeric" }));
        }
        return labels;
    }, [start]);

    const renderCell = (value) => {
        const className = value === "Off" ? "off-cell" : "shift-cell";
        return <td className={className}>{value}</td>;
    };

    const handleSearch = async (s = start, e = end) => {
        if (!s || !e) {
            setMessage({ type: "error", text: "Please select both start and end dates" });
            return;
        }

        try {
            const shiftsPromise = user?.role?.toUpperCase() === "EMPLOYEE" ? getPublishedWeeklyShifts(s, e) : getWeeklyShifts(s, e);
                
            const [shifts, employees] = await Promise.all([shiftsPromise, getEmployees()]);

            const transformed = transformRosterData(shifts, employees);
            setRosterData(transformed);

            setMessage({ type: "success", text: "Weekly roster loaded successfully" });
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.detail || "Failed to load weekly roster" });
        }
    };

    const changeWeek = (weekOffset) => {
        const sDate = new Date(start);
        const eDate = new Date(end);
        sDate.setDate(sDate.getDate() + weekOffset * 7);
        eDate.setDate(eDate.getDate() + weekOffset * 7);
        const newStart = sDate.toISOString().split("T")[0];
        const newEnd = eDate.toISOString().split("T")[0];

        setStart(newStart);
        setEnd(newEnd);
        handleSearch(newStart, newEnd);
    };
    return (
        <section className="page-section">
            <h2>Weekly Roster</h2>

            {message && <div className={`alert ${message.type}`}>{message.text}</div>}

            <div className="card">
                <div className="form-row">
                    <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                    <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button aria-label="Previous week" onClick={() => changeWeek(-1)}>
                            ←
                        </button>
                        <button aria-label="Next week" onClick={() => changeWeek(1)}>
                            →
                        </button>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>Weekly Calendar View</h3>

                <div style={{ overflowX: "auto" }}>
                    <table className="roster-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                {daysOfWeek.map((day, idx) => (
                                    <th key={day} style={{ textAlign: "left" }}>
                                        <div>
                                            {day} / {weekDateLabels[idx]}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRosterData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No roster data available
                                    </td>
                                </tr>
                            ) : (
                                filteredRosterData.map((row) => (
                                    <tr key={row.employeeName}>
                                        <td>
                                            <strong>{row.employeeName}</strong>
                                        </td>
                                        {renderCell(row.Mon)}
                                        {renderCell(row.Tue)}
                                        {renderCell(row.Wed)}
                                        {renderCell(row.Thu)}
                                        {renderCell(row.Fri)}
                                        {renderCell(row.Sat)}
                                        {renderCell(row.Sun)}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default WeeklyRosterPage;
