import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/apiService";
import Loading from "../component/Loading"; // Naama create panna Loading component
import SuccessToast from "../component/SuccessToast"; // Naama create panna SuccessToast

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin-dcw@dcw");
  const [password, setPassword] = useState("Iron@Fe#Admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false); // Toast control state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = { username: email, password };
    try {
      const response = await login(payload);
      // Backend apiResponse structure-ai check pannikonga (e.g., response.status === true)
      if (response) {
        setShowToast(true); // Right side-la toast kaattum
        
        // 2 seconds kalitthu navigate aagum
        setTimeout(() => {
          navigate("/landing");
        }, 2000);
      } else {
        setError("Invalid Email or Password. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.loginPage}>
      {/* Toast right side corner-la kaatta */}
      <SuccessToast 
        show={showToast} 
        message="Login Successful! Welcome to CCTS." 
        onClose={() => setShowToast(false)} 
      />

      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>
          <h2 style={{ margin: 0 }}>🎯 DCW Login</h2>
          <p style={{ opacity: 0.9, fontSize: "14px", marginTop: "5px" }}>
            Complaint Tracking System
          </p>
        </div>

        <form onSubmit={handleLogin} style={styles.loginForm}>
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="text"
              placeholder="Enter username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.loginBtn} disabled={loading}>
            {loading ? "Authenticating..." : "Login to System"}
          </button>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <Loading message="Validating Credentials..." />
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  loginPage: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
  loginCard: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    overflow: "hidden",
    zIndex: 1,
  },
  loginHeader: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "40px 30px",
    textAlign: "center",
  },
  loginForm: {
    padding: "40px 30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#4a5568",
  },
  input: {
    padding: "14px",
    border: "2px solid #edf2f7",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  loginBtn: {
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
    marginTop: "10px",
  },
  errorBox: {
    padding: "12px",
    backgroundColor: "#fff5f5",
    color: "#c53030",
    borderRadius: "8px",
    fontSize: "13px",
    textAlign: "center",
    border: "1px solid #feb2b2",
  },
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    backdropFilter: "blur(4px)",
  }
};

export default Login;