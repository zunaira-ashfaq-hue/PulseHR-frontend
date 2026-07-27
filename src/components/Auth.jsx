import { useState } from "react";
import { useToast } from "./Toast";

// Dynamic API URL: Automatically switch between local & production server
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://pulse-hr-backend-zunairashfaq278-9606s.vercel.app/api"; // Aapka backend URL

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "employee",
    department: "",
    position: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      console.log("Login Status:", res.status);
      console.log("Login Response:", data);

      if (res.ok) {
        toast.success("Login successful!");

        // Token & Employee data secure save in LocalStorage
        if (data.token) localStorage.setItem("token", data.token);
        if (data.employee) localStorage.setItem("user", JSON.stringify(data.employee));

        // Callback call
        if (onLogin) {
          onLogin(data.token, data.employee);
        }

        // Fresh page load redirect to completely remove login loop issue
        window.location.href = "/dashboard";
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Error connecting to server");
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      email,
      password,
      name,
      department,
      position,
      phone,
      role,
    } = formData;

    if (!email || !password || !name || !department || !position || !phone) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          department,
          position,
          phone,
          role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful! Please login.");

        setFormData({
          email: "",
          password: "",
          name: "",
          role: "employee",
          department: "",
          position: "",
          phone: "",
        });

        setIsLogin(true);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>PulseHR: Employee Management System</h1>
            <p>Streamline your workforce management</p>
          </div>

          <div className="auth-body">
            <div className="tabs">
              <button
                className={`tab ${isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>

              <button
                className={`tab ${!isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
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

                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="IT, HR, Sales"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    placeholder="Developer, Manager"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;