import { useEffect, useState } from "react";
import api from "../api/axios";

function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/all");
      if (res.data.success) {
        setAppointments(res.data.appointments || []);
      } else {
        console.error("Error fetching appointments:", res.data.message);
        setAppointments([]);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    }
  };

  const updateStatus = async (id, status) => {
    if (!status) return;

    const confirmAction = window.confirm(
      `Are you sure you want to change status to "${status}"?`
    );

    if (!confirmAction) return;

    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter logic
 const filteredAppointments = appointments.filter((appt) => {
  const statusMatch = statusFilter ? appt.status === statusFilter : true;
  return statusMatch;
});

  // Styles
  const thStyle = {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    borderBottom: "1px solid #e5e7eb"
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb"
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#f59e0b";
      case "CONFIRMED":
        return "#3b82f6";
      case "COMPLETED":
        return "#10b981";
      case "CANCELLED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px"
        }}
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Consultant</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Update</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No appointments found
              </td>
            </tr>
          ) : (
            filteredAppointments.map((a) => (
              <tr
                key={a._id}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td style={tdStyle}>
                  {a.user?.name || "N/A"}
                  <br />
                  <small style={{ color: "#6b7280" }}>{a.user?.email}</small>
                </td>
                <td style={tdStyle}>
                  {a.consultant?.name || "N/A"}
                  <br />
                  <small style={{ color: "#6b7280" }}>
                    {a.consultant?.specialization}
                  </small>
                </td>
                <td style={tdStyle}>
                  {a.date ? new Date(a.date).toLocaleDateString() : "N/A"}
                </td>
                <td style={tdStyle}>{a.timeSlot || "N/A"}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#fff",
                      backgroundColor: getStatusColor(a.status)
                    }}
                  >
                    {a.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <select
                    defaultValue=""
                    onChange={(e) =>
                      updateStatus(a._id, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Change
                    </option>
                    {a.status !== "CONFIRMED" && (
                      <option value="CONFIRMED">CONFIRMED</option>
                    )}
                    {a.status !== "CANCELLED" && (
                      <option value="CANCELLED">CANCELLED</option>
                    )}
                    {a.status !== "COMPLETED" && (
                      <option value="COMPLETED">COMPLETED</option>
                    )}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentTable;
