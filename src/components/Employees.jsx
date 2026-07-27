import { useState, useEffect } from "react";
import { useToast } from "./Toast";

const API_URL = "https://pulsehr-backend-sa06.onrender.com/api";

function Employees({ token, isAdmin }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    position: "",
    phone: "",
    role: "employee",
  });

  const loadEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
        const depts = [
          ...new Set(data.map((e) => e.department).filter(Boolean)),
        ];
        setDepartments(depts);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const filterEmployees = () => {
    const filtered = employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.position &&
          emp.position.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDept = !deptFilter || emp.department === deptFilter;
      return matchesSearch && matchesDept;
    });
    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, deptFilter, employees]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      department: "",
      position: "",
      phone: "",
      role: "employee",
    });
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    setEditingId(id);
    try {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const emp = await res.json();
        setFormData({
          name: emp.name,
          email: emp.email,
          password: "",
          department: emp.department,
          position: emp.position,
          phone: emp.phone,
          role: emp.role,
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error loading employee:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, department, position, phone, role } =
      formData;

    if (!name || !email || !department || !position) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data = { name, email, department, position, phone, role };
    if (password || !editingId) {
      data.password = password;
    }

    try {
      const url = editingId
        ? `${API_URL}/employees/${editingId}`
        : `${API_URL}/employees`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(editingId ? "Employee updated!" : "Employee added!");
        setShowModal(false);
        loadEmployees();
      } else {
        toast.error(result.message || "Operation failed");
      }
    } catch {
      toast.error("Error saving employee");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Employee deleted successfully");
        loadEmployees();
      } else {
        toast.error("Failed to delete employee");
      }
    } catch {
      toast.error("Error deleting employee");
    }
  };

  return (
    <div>
      <div className="content-header">
        <h2>Employee Management</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Employee
          </button>
        )}
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Role</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  style={{
                    textAlign: "center",
                    padding: "60px",
                    color: "#9ca3af",
                  }}
                >
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <strong>{emp.name}</strong>
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.department || "-"}</td>
                  <td>{emp.position || "-"}</td>
                  <td>
                    <span className="badge badge-info">{emp.role}</span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${emp.status === "active" ? "success" : "danger"}`}
                    >
                      {emp.status || "active"}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => openEditModal(emp._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(emp._id)}
                        >
                          Delete
                        </button>
                      </div>
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
              <h2>{editingId ? "Edit Employee" : "Add New Employee"}</h2>
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
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder={editingId ? "Leave blank to keep current" : ""}
                    value={formData.password}
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
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  Save Employee
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
