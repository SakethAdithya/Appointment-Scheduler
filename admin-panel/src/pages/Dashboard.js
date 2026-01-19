import AppointmentTable from "../components/AppointmentTable";

function Dashboard({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <div style={{ padding: "40px", background: "#f1f5f9", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px"
          }}
        >
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "36px", fontWeight: "bold", color: "#1e293b" }}>
              Appointment Scheduler
            </h1>
            <p style={{ margin: 0, color: "#64748b", fontSize: "16px" }}>Admin Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Logout
          </button>
        </div>

        {/* Appointment table */}
        <AppointmentTable />
      </div>
    </div>
  );
}

export default Dashboard;
