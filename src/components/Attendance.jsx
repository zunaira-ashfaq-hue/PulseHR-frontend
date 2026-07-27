import { useState, useEffect } from "react";
import { useToast } from "./Toast";

const API_URL = "https://pulsehr-backend-sa06.onrender.com/api";

function Attendance({ token, user, isAdmin }) {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    checkIn: "",
    checkOut: "",
    notes: "",
  });

  const loadAttendance = async () => {
    try {
      const url = isAdmin
        ? `${API_URL}/attendance`
        : `${API_URL}/attendance/employee/${user._id}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAttendance(data);
      }
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
  };

  const loadTodayAttendance = async () => {
    if (isAdmin) return; // Admins don't need today's attendance

    try {
      const res = await fetch(`${API_URL}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTodayAttendance(data);
      }
    } catch (error) {
      console.error("Error loading today's attendance:", error);
    }
  };

  useEffect(() => {
    loadAttendance();
    loadTodayAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        // Filter out the current admin user from the list - admins cannot mark their own attendance
        const filteredEmployees = data.filter((emp) => emp._id !== user._id);
        setEmployees(filteredEmployees);
      }
    } catch (err) {
      console.error("Error loading employees:", err);
    }
  };

  const openModal = () => {
    loadEmployees();
    setFormData({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      status: "present",
      checkIn: "",
      checkOut: "",
      notes: "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent admin from marking their own attendance
    if (formData.employeeId === user._id) {
      toast.error("You cannot mark your own attendance");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Attendance marked successfully!");
        setShowModal(false);
        loadAttendance();
      } else {
        toast.error(result.message || "Failed to mark attendance");
      }
    } catch {
      toast.error("Error saving attendance");
    }
  };

  const handleSelfAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/attendance/self`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        loadAttendance();
        loadTodayAttendance();
      } else {
        toast.error(result.message || "Failed to mark attendance");
      }
    } catch {
      toast.error("Error marking attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="content-header">
        <h2>Attendance Records</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openModal}>
            + Mark Attendance
          </button>
        )}
      </div>

      {!isAdmin && (
        <div
          className="card"
          style={{
            marginBottom: "24px",
            padding: "24px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "250px" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
                Today's Attendance
              </h3>
              {todayAttendance ? (
                <div style={{ fontSize: "14px", opacity: 0.95 }}>
                  <p style={{ margin: "4px 0" }}>
                    Status:{" "}
                    <strong style={{ textTransform: "capitalize" }}>
                      {todayAttendance.status}
                    </strong>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    Check In:{" "}
                    <strong>{todayAttendance.checkIn || "Not yet"}</strong>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    Check Out:{" "}
                    <strong>{todayAttendance.checkOut || "Not yet"}</strong>
                  </p>
                </div>
              ) : (
                <p style={{ margin: "8px 0", fontSize: "14px", opacity: 0.9 }}>
                  You haven't marked your attendance today
                </p>
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleSelfAttendance}
                disabled={
                  loading || (todayAttendance && todayAttendance.checkOut)
                }
                className="btn btn-primary"
                style={{
                  padding: "12px 32px",
                  fontSize: "16px",
                  background:
                    todayAttendance && todayAttendance.checkOut
                      ? "#9ca3af"
                      : "white",
                  color:
                    todayAttendance && todayAttendance.checkOut
                      ? "white"
                      : "#059669",
                  border: "none",
                  fontWeight: "bold",
                  cursor:
                    todayAttendance && todayAttendance.checkOut
                      ? "not-allowed"
                      : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Processing..."
                  : todayAttendance
                    ? todayAttendance.checkOut
                      ? "Completed"
                      : "Check Out"
                    : "Check In"}
              </button>
              {todayAttendance && todayAttendance.checkOut && (
                <p style={{ margin: "8px 0", fontSize: "12px", opacity: 0.9 }}>
                  Attendance completed for today
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!isAdmin && (
        <div
          className="alert alert-info"
          style={{
            background: "#dbeafe",
            color: "#1d4ed8",
            borderColor: "#93c5fd",
            marginBottom: "24px",
          }}
        >
          <strong>ℹ</strong> Use the Check In/Check Out button above to mark
          your attendance. Your attendance records are shown below.
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#9ca3af",
                  }}
                >
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendance.map((att) => (
                <tr key={att._id}>
                  <td>
                    <strong>{att.employeeId?.name || "N/A"}</strong>
                  </td>
                  <td>{new Date(att.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge badge-${att.status === "present" ? "success" : att.status === "absent" ? "danger" : "warning"}`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td>{att.checkIn || "-"}</td>
                  <td>{att.checkOut || "-"}</td>
                  <td>{att.notes || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Mark Attendance</h2>
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select Employee</label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose an employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Attendance Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="half-day">Half Day</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Check In Time</label>
                  <input
                    type="time"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Check Out Time</label>
                  <input
                    type="time"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    rows="3"
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Save Attendance
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
