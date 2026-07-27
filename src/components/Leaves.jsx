import { useState, useEffect } from "react";
import { useToast } from "./Toast";

const API_URL = "https://pulsehr-backend-sa06.onrender.com/api";

function Leaves({ token, user, isAdmin }) {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    leaveType: "casual",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
  });

  const loadLeaves = async () => {
    try {
      const url = isAdmin
        ? `${API_URL}/leaves`
        : `${API_URL}/leaves/employee/${user._id}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (error) {
      console.error("Error loading leaves:", error);
    }
  };

  useEffect(() => {
    loadLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      leaveType: "casual",
      startDate: today,
      endDate: today,
      reason: "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason.trim()) {
      toast.error("Please provide a reason for leave");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/leaves`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, employeeId: user._id }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Leave request submitted successfully!");
        setShowModal(false);
        loadLeaves();
      } else {
        toast.error(result.message || "Failed to submit leave request");
      }
    } catch {
      toast.error("Error applying leave");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/leaves/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(
          `Leave ${status === "approved" ? "approved" : "rejected"} successfully`,
        );
        loadLeaves();
      } else {
        toast.error("Failed to update leave status");
      }
    } catch {
      toast.error("Error updating leave status");
    }
  };

  return (
    <div>
      <div className="content-header">
        <h2>Leave Requests</h2>
        <button className="btn btn-primary" onClick={openModal}>
          + Apply Leave
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#9ca3af",
                  }}
                >
                  No leave requests found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>
                    <strong>{leave.employeeId?.name || "N/A"}</strong>
                  </td>
                  <td>
                    <span className="badge badge-info">{leave.leaveType}</span>
                  </td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span
                      className={`badge badge-${leave.status === "approved" ? "success" : leave.status === "rejected" ? "danger" : "warning"}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      {leave.status === "pending" ? (
                        <div className="action-buttons">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => updateStatus(leave._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => updateStatus(leave._id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  )}
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
              <h2>Apply for Leave</h2>
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Leave Type</label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                  >
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                    <option value="vacation">Vacation Leave</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Reason for Leave</label>
                  <textarea
                    name="reason"
                    rows="4"
                    placeholder="Describe your reason..."
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Submit Leave Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaves;
