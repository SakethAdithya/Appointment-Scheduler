import { useState } from "react";
import api from "../api/axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
  try {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    console.log("Sending login request", email, password);

    const res = await api.post("/auth/login", { email, password });

    console.log("Login response:", res.data);

    // Check if response has success and user data
    if (!res.data.success) {
      alert(res.data.message || "Login failed");
      return;
    }

    // Check role - backend returns user object with role
    if (res.data.user && res.data.user.role !== "ADMIN") {
      alert("Admin access only");
      return;
    }

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      onLogin();
    } else {
      alert("Token not received from server");
    }
  } catch (err) {
    console.error("Login error:", err);
    const errorMessage = err.response?.data?.message || err.message || "Invalid credentials";
    alert(errorMessage);
  }
};


  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1 style={{ marginBottom: "8px", fontSize: "36px", fontWeight: "bold", color: "#1e293b" }}>
        Appointment Scheduler
      </h1>
      <h2 style={{ marginTop: "0", color: "#64748b" }}>Admin Login</h2>
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
