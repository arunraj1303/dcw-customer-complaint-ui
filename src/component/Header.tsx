import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Active path check panna helper
  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={headerStyles.header}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>
        📊 Customer Complaint Tracking System
      </h1>
      <p style={{ opacity: 0.9 }}>Quality Assurance & Resolution Tracking</p>
      
      <div style={headerStyles.navLinks}>
        
        <button 
          style={{ 
            ...headerStyles.navBtn, 
            background: isActive("/complaint-create") ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)" 
          }} 
          onClick={() => navigate("/complaint-create")}
        >
          Create Complaint
        </button>
        <button 
          style={{ 
            ...headerStyles.navBtn, 
            background: isActive("/issue-identified") ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)" 
          }} 
          onClick={() => navigate("/issue-identified")}
        >
          Issue Identification
        </button>
        <button 
          style={{ 
            ...headerStyles.navBtn, 
            background: isActive("/final-status") ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)" 
          }} 
          onClick={() => navigate("/final-status")}
        >
          Final Status
        </button>
      </div>
    </div>
  );
};

const headerStyles: { [key: string]: React.CSSProperties } = {
  header: { 
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
    color: "white", 
    padding: "30px",
    width: "100%"
  },
  navLinks: { display: "flex", gap: "10px", marginTop: "20px" },
  navBtn: { 
    border: "none", 
    color: "white", 
    padding: "8px 16px", 
    borderRadius: "4px", 
    cursor: "pointer",
    transition: "0.3s",
    fontWeight: "500"
  }
};

export default Header;