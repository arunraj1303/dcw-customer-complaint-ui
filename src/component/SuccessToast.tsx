import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const SuccessToast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3 seconds to auto-close
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div style={styles.toastContainer} className="toast-animation">
      <div style={styles.toastCard}>
        <div style={styles.iconCircle}>
          <span style={styles.tick}>✓</span>
        </div>
        <div style={styles.content}>
          <h4 style={styles.title}>Success!</h4>
          <p style={styles.message}>{message}</p>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>&times;</button>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .toast-animation {
            animation: slideIn 0.4s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  toastContainer: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 9999,
    animation: "slideIn 0.4s ease-out forwards",
  },
  toastCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f0fff4",
    padding: "16px 20px",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    borderLeft: "6px solid #48bb78",
    minWidth: "320px",
    gap: "15px",
    transition: "box-shadow 0.3s ease",
  },
  iconCircle: {
    width: "40px",
    height: "40px",
    backgroundColor: "#e6fffa",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #38a169",
  },
  tick: {
    color: "#38a169",
    fontWeight: "bold",
    fontSize: "20px",
  },
  content: {
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: "16px",
    color: "#2d3748",
    fontWeight: "bold",
  },
  message: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#4a5568",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#a0aec0",
    cursor: "pointer",
    padding: "0 5px",
  },
};

export default SuccessToast;