import { useState, useEffect } from "react";
import { useToast } from "./Toast";

const API_URL = "https://pulsehr-backend-sa06.onrender.com/api";

function Feedback({ token, isAdmin }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    type: "feedback",
    subject: "",
    message: "",
    isAnonymous: false,
  });

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const url = isAdmin ? `${API_URL}/feedback` : `${API_URL}/feedback/my`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);
      } else {
        toast.error("Failed to load feedback");
      }
    } catch (error) {
      console.error("Error loading feedback:", error);
      toast.error("Error loading feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = () => {
    setFormData({
      type: "feedback",
      subject: "",
      message: "",
      isAnonymous: false,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Feedback submitted successfully!");
        setShowModal(false);
        loadFeedback();
      } else {
        toast.error(result.message || "Failed to submit feedback");
      }
    } catch {
      toast.error("Error submitting feedback");
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "complaint":
        return "danger";
      case "suggestion":
        return "info";
      default:
        return "success";
    }
  };

  return (
    <div>
      <div className="content-header">
        <h2>{isAdmin ? "All Feedback" : "My Feedback"}</h2>
        {!isAdmin && (
          <button className="btn btn-primary" onClick={openModal}>
            + Add Feedback
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div
            style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}
          >
            Loading feedback...
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {isAdmin && <th>From</th>}
                <th>Type</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    style={{
                      textAlign: "center",
                      padding: "60px",
                      color: "#9ca3af",
                    }}
                  >
                    {isAdmin
                      ? "No feedback received yet"
                      : "You haven't submitted any feedback yet."}
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb._id}>
                    {isAdmin && (
                      <td>
                        <strong>{fb.employeeId?.name || "N/A"}</strong>
                        {fb.isAnonymous && (
                          <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                            {" "}
                            (Anonymous)
                          </span>
                        )}
                      </td>
                    )}
                    <td>
                      <span className={`badge badge-${getTypeColor(fb.type)}`}>
                        {fb.type}
                      </span>
                    </td>
                    <td>
                      <strong>{fb.subject}</strong>
                    </td>
                    <td
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={fb.message}
                    >
                      {fb.message}
                    </td>
                    <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Submit Feedback Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Feedback</h2>
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="feedback">General Feedback</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Brief subject of your feedback"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Describe your feedback in detail..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div
                  className="form-group"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    id="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    style={{ width: "auto" }}
                  />
                  <label
                    htmlFor="isAnonymous"
                    style={{ margin: 0, cursor: "pointer" }}
                  >
                    Submit anonymously
                  </label>
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;
