import { useEffect, useState } from "react";
import { getEmployees } from "../services/employeeService";
import { getWeeklyShifts, createShift, updateShift, deleteShift, publishWeek } from "../services/shiftService";
import ShiftForm from "../components/ShiftForm";
import ShiftList from "../components/ShiftList";

//week-based shift management. Pick a week, add/edit/delete shifts, and publish.
function ShiftsPage({ user }) {
    // Helper to get current week's Monday-Sunday range as YYYY-MM-DD
    const getCurrentWeekRange = () => {
        const today = new Date();
        const day = today.getDay();
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

    // start/end control which week is shown
    const [start, setStart] = useState(initialWeek.start);
    const [end, setEnd] = useState(initialWeek.end);

    // data and UI state
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [editingShift, setEditingShift] = useState(null);
    const [message, setMessage] = useState(null);

    // load shifts and employees for the current week
    const loadData = async () => {
        try {
            const [shiftData, employeeData] = await Promise.all([getWeeklyShifts(start, end), getEmployees()]);

            setShifts(shiftData);
            setEmployees(employeeData);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.detail || "Failed to load shifts",
            });
        }
    };

    // on mount: fetch the current week
    useEffect(() => {
        loadData();
    }, []);

    // Create or update shift depending on editing state
    const handleSaveShift = async (payload) => {
        try {
            if (editingShift) {
                await updateShift(editingShift.id, payload);
                setMessage({
                    type: "success",
                    text: "Shift updated successfully",
                });
            } else {
                await createShift(payload);
                setMessage({
                    type: "success",
                    text: "Shift created successfully",
                });
            }

            setEditingShift(null);
            await loadData();
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.detail || "Failed to save shift",
            });
        }
    };

    // start editing a shift — populate the form via `editingShift`
    const handleEditShift = (shift) => {
        setEditingShift(shift);
        setMessage(null);
    };

    // delete shift and refresh
    const handleDeleteShift = async (id) => {
        try {
            await deleteShift(id);

            setMessage({
                type: "success",
                text: "Shift deleted successfully",
            });

            if (editingShift?.id === id) {
                setEditingShift(null);
            }

            await loadData();
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.detail || "Failed to delete shift",
            });
        }
    };

    // cancel editing
    const handleCancelEdit = () => {
        setEditingShift(null);
        setMessage(null);
    };

    // move the selected week forward or backward by 1 week
    const moveWeek = (direction) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        startDate.setDate(startDate.getDate() + direction * 7);
        endDate.setDate(endDate.getDate() + direction * 7);

        setStart(startDate.toISOString().split("T")[0]);
        setEnd(endDate.toISOString().split("T")[0]);
    };

    // publish the week (server sends notifications)
    const handlePublishWeek = async () => {
        try {
            await publishWeek(start, end);
            setMessage({
                type: "success",
                text: "Week published and notifications sent",
            });
            await loadData();
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.detail || "Failed to publish week",
            });
        }
    };

    // quick helper to decide if all shifts are published
    const allPublished = shifts.length > 0 && shifts.every(shift => shift.published === true);

    return (
        <section className="page-section">
            <h2>Shifts</h2>

            {message && <div className={`alert ${message.type}`}>{message.text}</div>}

            <div className="card">
                <h3>Week Filter</h3>

                <div className="form-row">
                    {/* navigate weeks */}
                    <button type="button" onClick={() => moveWeek(-1)}>
                        Previous Week
                    </button>

                    {/* pick start/end dates manually */}
                    <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />

                    <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />

                    <button type="button" onClick={loadData}>
                        Load Week
                    </button>

                    <button type="button" onClick={() => moveWeek(1)}>
                        Next Week
                    </button>

                    {/* publish button shows different text if already published */}
                    <button type="button" onClick={handlePublishWeek}>
                        {allPublished ? "Already Published" : "Publish Week"}
                    </button>
                </div>
            </div>

            <div className="card">
                <h3>{editingShift ? "Edit Shift" : "Add Shift"}</h3>
                <ShiftForm employees={employees} editingShift={editingShift} onSaveShift={handleSaveShift} onCancelEdit={handleCancelEdit} />
            </div>

            <div className="card">
                <h3>Shift List for Selected Week</h3>
                <ShiftList shifts={shifts} onEditShift={handleEditShift} onDeleteShift={handleDeleteShift} />
            </div>
        </section>
    );
}

export default ShiftsPage;
