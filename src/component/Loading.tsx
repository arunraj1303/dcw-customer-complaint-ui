import React from "react";

const Loading: React.FC<{ message?: string }> = ({ message = "Fetching Data..." }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.loaderContainer}>
        {/* Animated Spinner */}
        <div style={styles.spinner}></div>
        
        {/* Pulse Effect Circles */}
        <div style={styles.pulse}></div>
        
        <p style={styles.text}>{message}</p>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.2; }
            100% { transform: scale(0.8); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    width: "100%",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #667eea", // Unga theme color
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    zIndex: 2,
  },
  pulse: {
    position: "absolute",
    top: "-5px",
    width: "60px",
    height: "60px",
    backgroundColor: "#667eea",
    borderRadius: "50%",
    animation: "pulse 2s ease-in-out infinite",
    zIndex: 1,
  },
  text: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#718096",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
};

export default Loading;