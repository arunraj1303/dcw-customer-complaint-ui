import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.body}>
      {/* Dynamic Background */}
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>

      <div style={styles.mainContent}>
        <div style={styles.heroSection}>
          <div style={styles.logoBadge}>CCTS v3.0</div>
          <h1 style={styles.title}>
            Complaint <span style={{ color: "#667eea" }}>Management</span> Reimagined.
          </h1>
          <p style={styles.subtitle}>
            Seamlessly track customer feedback, manage product quality, and drive 
            resolutions with our unified tracking system.
          </p>
        </div>

        {/* Action Grid - Inthaye Navigation-a use pannikalam */}
        <div style={styles.grid}>
          {/* Create Card */}
          <div 
            style={{...styles.card, borderTop: "5px solid #667eea"}}
            onClick={() => navigate("/complaint-create")}
          >
            <div style={styles.icon}>➕</div>
            <div style={styles.cardInfo}>
                <h3 style={styles.cardTitle}>New Complaint</h3>
                <p style={styles.cardDesc}>Register a customer issue with all shipment details.</p>
            </div>
            <div style={styles.arrow}>→</div>
          </div>

          {/* Identification Card */}
          <div 
            style={{...styles.card, borderTop: "5px solid #764ba2"}}
            onClick={() => navigate("/issue-identified")}
          >
            <div style={{...styles.icon, background: '#f3ebff', color: '#764ba2'}}>🔍</div>
            <div style={styles.cardInfo}>
                <h3 style={styles.cardTitle}>Identify Issues</h3>
                <p style={styles.cardDesc}>Analyze root causes and track identification progress.</p>
            </div>
            <div style={styles.arrow}>→</div>
          </div>

          {/* Dashboard/Status Card */}
          <div 
            style={{...styles.card, borderTop: "5px solid #2d3748"}}
            onClick={() => navigate("/final-status")}
          >
            <div style={{...styles.icon, background: '#e2e8f0', color: '#2d3748'}}>📊</div>
            <div style={styles.cardInfo}>
                <h3 style={styles.cardTitle}>Final Status</h3>
                <p style={styles.cardDesc}>View all reports, closure rates, and resolution times.</p>
            </div>
            <div style={styles.arrow}>→</div>
          </div>
        </div>

        <footer style={styles.footer}>
            Quality Assurance Department • 2026
        </footer>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  body: { 
    backgroundColor: "#f8fafc", 
    minHeight: "100vh", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "20px"
  },
  // Background Blobs
  circle1: { position: "absolute", top: "-100px", left: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", opacity: 0.1, zIndex: 0 },
  circle2: { position: "absolute", bottom: "-50px", right: "-50px", width: "300px", height: "300px", borderRadius: "50%", background: "#667eea", opacity: 0.05, zIndex: 0 },
  
  mainContent: { zIndex: 1, maxWidth: "1000px", width: "100%", textAlign: "center" },
  
  heroSection: { marginBottom: "60px" },
  logoBadge: { display: "inline-block", padding: "6px 15px", backgroundColor: "#667eea", color: "white", borderRadius: "50px", fontSize: "12px", fontWeight: "bold", marginBottom: "20px" },
  title: { fontSize: "52px", color: "#1a202c", fontWeight: "850", letterSpacing: "-1px", marginBottom: "20px" },
  subtitle: { fontSize: "19px", color: "#4a5568", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" },
  
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px", marginTop: "40px" },
  
  card: { 
    backgroundColor: "white", 
    padding: "30px", 
    borderRadius: "20px", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)", 
    textAlign: "left", 
    cursor: "pointer", 
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    position: "relative"
  },
  icon: { width: "50px", height: "50px", background: "#ebf4ff", color: "#667eea", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: "20px", color: "#2d3748", fontWeight: "bold", marginBottom: "10px" },
  cardDesc: { fontSize: "14px", color: "#718096", lineHeight: "1.5" },
  arrow: { alignSelf: "flex-end", color: "#cbd5e0", fontSize: "20px", fontWeight: "bold" },
  
  footer: { marginTop: "60px", color: "#a0aec0", fontSize: "13px", fontWeight: "500", letterSpacing: "1px" }
};

export default LandingPage;