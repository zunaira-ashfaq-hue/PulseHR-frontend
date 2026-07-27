import { useState, useEffect } from "react";

const API_URL = "https://pulsehr-backend-sa06.onrender.com/api";

// Icons
const FormIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const TaskIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
);

const ClockIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

function Dashboard({ token, user, isAdmin }) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    employeesByDepartment: [],
  });
  const [employeeStats, setEmployeeStats] = useState({
    myAttendance: 0,
    myPendingLeaves: 0,
    myApprovedLeaves: 0,
    recentAttendance: [],
  });

  const loadDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setStats({
          totalEmployees: data.totalEmployees || 0,
          presentToday: data.presentToday || 0,
          pendingLeaves: data.leaveStats?.pending || 0,
          approvedLeaves: data.leaveStats?.approved || 0,
          employeesByDepartment: data.employeesByDepartment || [],
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  const loadEmployeeStats = async () => {
    try {
      // Load my attendance
      const attendanceRes = await fetch(
        `${API_URL}/attendance/employee/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Load my leaves
      const leavesRes = await fetch(`${API_URL}/leaves/employee/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let myAttendance = 0;
      let recentAttendance = [];
      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        myAttendance = attendanceData.filter(
          (a) => a.status === "present",
        ).length;
        recentAttendance = attendanceData.slice(0, 5);
      }

      let myPendingLeaves = 0;
      let myApprovedLeaves = 0;
      if (leavesRes.ok) {
        const leavesData = await leavesRes.json();
        myPendingLeaves = leavesData.filter(
          (l) => l.status === "pending",
        ).length;
        myApprovedLeaves = leavesData.filter(
          (l) => l.status === "approved",
        ).length;
      }

      setEmployeeStats({
        myAttendance,
        myPendingLeaves,
        myApprovedLeaves,
        recentAttendance,
      });
    } catch (error) {
      console.error("Error loading employee stats:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboard();
    } else {
      loadEmployeeStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Employee Dashboard
  if (!isAdmin) {
    return (
      <div>
        {/* Welcome Message */}
        <div className="section-card" style={{ marginBottom: "24px" }}>
          <div style={{ padding: "24px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "var(--dark)",
                marginBottom: "8px",
              }}
            >
              Welcome back, {user.name}! 👋
            </h2>
            <p style={{ color: "var(--text-light)", fontSize: "14px" }}>
              Here's an overview of your activity and status.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon green">
              <CheckIcon />
            </div>
            <div className="stat-content">
              <div className="stat-label">Days Present</div>
              <div className="stat-value">{employeeStats.myAttendance}</div>
              <div className="stat-subtitle">Total attendance</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <ClockIcon />
            </div>
            <div className="stat-content">
              <div className="stat-label">Pending Leaves</div>
              <div className="stat-value">{employeeStats.myPendingLeaves}</div>
              <div className="stat-subtitle">Awaiting approval</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <CalendarIcon />
            </div>
            <div className="stat-content">
              <div className="stat-label">Approved Leaves</div>
              <div className="stat-value">{employeeStats.myApprovedLeaves}</div>
              <div className="stat-subtitle">This period</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon teal">
              <FormIcon />
            </div>
            <div className="stat-content">
              <div className="stat-label">Department</div>
              <div className="stat-value" style={{ fontSize: "16px" }}>
                {user.department}
              </div>
              <div className="stat-subtitle">{user.position}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="section-card">
            <div className="section-card-header">
              <h3>Recent Attendance</h3>
            </div>
            {employeeStats.recentAttendance.length > 0 ? (
              <div style={{ padding: "16px 24px" }}>
                {employeeStats.recentAttendance.map((record, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom:
                        idx < employeeStats.recentAttendance.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    <span style={{ color: "var(--text)" }}>
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                    <span
                      className={`badge badge-${record.status === "present" ? "success" : record.status === "absent" ? "danger" : "warning"}`}
                    >
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="section-card-content">
                No attendance records yet
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard

  return (
    <div>
      {/* Stats Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon orange">
            <FormIcon />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{stats.totalEmployees}</div>
            <div className="stat-subtitle">Active</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckIcon />
          </div>
          <div className="stat-content">
            <div className="stat-label">Present Today</div>
            <div className="stat-value">{stats.presentToday}</div>
            <div className="stat-subtitle">Total present</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <CalendarIcon />
          </div>
          <div className="stat-content">
            <div className="stat-label">Pending Leaves</div>
            <div className="stat-value">{stats.pendingLeaves}</div>
            <div className="stat-subtitle">Awaiting approval</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teal">
            <TaskIcon />
          </div>
          <div className="stat-content">
            <div className="stat-label">Approved Leaves</div>
            <div className="stat-value">{stats.approvedLeaves}</div>
            <div className="stat-subtitle">This month</div>
          </div>
        </div>
      </div>

      {/* Section Cards Grid */}
      <div className="section-grid">
        <div className="section-card">
          <div className="section-card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="section-card-content">No recent activity</div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <h3>Recent Attendance</h3>
          </div>
          <div className="section-card-content">No attendance records yet</div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <h3>Upcoming Leaves</h3>
          </div>
          <div className="section-card-content">
            No upcoming leaves scheduled
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header">
            <h3>Department Overview</h3>
          </div>
          {stats.employeesByDepartment.length > 0 ? (
            <div style={{ padding: "16px 24px" }}>
              {stats.employeesByDepartment.map((dept, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom:
                      idx < stats.employeesByDepartment.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <span style={{ color: "var(--text)" }}>
                    {dept._id || "Unassigned"}
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--primary)" }}>
                    {dept.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="section-card-content">No department data</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
