import { useState } from "react";
import { useToast } from "./Toast";

const API_URL = "https://pulsehr-backend-sa06.onrender.com/api";

function Profile({ token, user, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    department: user.department,
    position: user.position,
    password: "",
  });

  const openModal = () => {
    setFormData({
      name: user.name,
      phone: user.phone,
      department: user.department,
      position: user.position,
      password: "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      phone: formData.phone,
      department: formData.department,
      position: formData.position,
    };

    if (formData.password) {
      data.password = formData.password;
    }

    try {
      const res = await fetch(`${API_URL}/employees/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setShowModal(false);
        onUpdate();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch {
      toast.error("Error updating profile");
    }
  };

  return (
    <div>
      <div className="content-header">
        <h2>My Profile</h2>
        <button className="btn btn-primary" onClick={openModal}>
          Edit Profile
        </button>
      </div>

      <div className="profile-section">
        <div className="profile-card">
          <h3>Personal Information</h3>
          <div className="profile-item">
            <span className="profile-label">Full Name</span>
            <span className="profile-value">{user.name || "-"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user.email || "-"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Phone</span>
            <span className="profile-value">{user.phone || "-"}</span>
          </div>
        </div>

        <div className="profile-card">
          <h3>Work Information</h3>
          <div className="profile-item">
            <span className="profile-label">Department</span>
            <span className="profile-value">{user.department || "-"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Position</span>
            <span className="profile-value">{user.position || "-"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Role</span>
            <span className="profile-value">{user.role || "-"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Status</span>
            <span className="profile-value">{user.status || "active"}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
