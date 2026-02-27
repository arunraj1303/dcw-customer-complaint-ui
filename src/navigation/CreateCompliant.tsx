import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaiant } from "../api/apiService";
import Header from "../component/Header";
import Loading from "../component/Loading"; // Loading component import
import SuccessToast from "../component/SuccessToast"; // SuccessToast import

// Interface Definition
interface ComplaintFormData {
  complaintId: string;
  customerType: string;
  customerName: string;
  complaintDate: string;
  natureOfComplaint: string;
  complaintSeverity: string;
  complaintDescription: string;
  shipmentDate: string;
  invoiceNumber: string;
  invoiceValue: number;
  productGrade: string;
  ciNo: string;
  productionBatch: string;
  quantity: number;
  packagingType: string;
  firstResponseSales: string;
  firstResponsePlant: string;
  stakeholders: string;
  status: string;
}

const CreateComplaint: React.FC = () => {
  const navigate = useNavigate();

  // New States for UI feedback
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState<ComplaintFormData>({
    complaintId: "",
    customerType: "",
    customerName: "",
    complaintDate: "",
    natureOfComplaint: "",
    complaintSeverity: "",
    complaintDescription: "",
    shipmentDate: "",
    invoiceNumber: "",
    invoiceValue: 0,
    productGrade: "",
    ciNo: "",
    productionBatch: "",
    quantity: 0,
    packagingType: "",
    firstResponseSales: "",
    firstResponsePlant: "",
    stakeholders: "",
    status: "Open",
  });

  useEffect(() => {
    const id = "CMP-1" + Date.now().toString().slice(-8);
    setFormData((prev) => ({ ...prev, complaintId: id }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const val = (name === "invoiceValue" || name === "quantity") ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start Loading
    
    try {
      const response = await createComplaiant(formData);
      // Inga response.success check-ai unga backend structure-ku etha maathiri mathikonga
      if (response) {
        setShowToast(true); // Show Success Message on Right Side
        
        // 2 seconds wait panni navigate aagum (Toast paarkurathukaga)
        setTimeout(() => {
          navigate("/issue-identified");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving complaint. Check console.");
    } finally {
      setLoading(false); // Stop Loading
    }
  };

  const handleReset = () => {
    if (window.confirm("Form-ai reset seiya virumbugireergala?")) {
      window.location.reload();
    }
  };

  return (
    <div style={styles.body}>
      {/* 1. Success Notification (Right Side) */}
      <SuccessToast 
        show={showToast} 
        message="Complaint Created Successfully! Redirecting..." 
        onClose={() => setShowToast(false)} 
      />

      {/* 2. Loading Overlay */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <Loading message="Saving Complaint to System..." />
        </div>
      )}

      <div style={styles.container}>
        <Header/>

        <div style={styles.content}>
          <form onSubmit={handleSubmit}>
            
            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>📋 Customer Information</h2>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Complaint ID</label>
                  <input type="text" name="complaintId" value={formData.complaintId} readOnly style={styles.inputReadOnly} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Customer Type *</label>
                  <select name="customerType" value={formData.customerType} onChange={handleChange} required style={styles.input}>
                    <option value="">Select Type</option>
                    <option value="Domestic Customer">Domestic Customer</option>
                    <option value="Export Customer">Export Customer</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Customer Name *</label>
                  <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Complaint Date *</label>
                  <input type="date" name="complaintDate" value={formData.complaintDate} onChange={handleChange} required style={styles.input} />
                </div>
              </div>
            </div>

            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>⚠️ Complaint Details</h2>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nature of Complaint *</label>
                  <select name="natureOfComplaint" value={formData.natureOfComplaint} onChange={handleChange} required style={styles.input}>
                    <option value="">Select Nature</option>
                    <option value="Product quality / specification">Product quality / specification</option>
                    <option value="Delivery delay">Delivery delay</option>
                    <option value="Packaging issue">Packaging issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Severity *</label>
                  <select name="complaintSeverity" value={formData.complaintSeverity} onChange={handleChange} required style={styles.input}>
                    <option value="">Select Severity</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Complaint Description *</label>
                  <textarea name="complaintDescription" value={formData.complaintDescription} onChange={handleChange} required style={{ ...styles.input, minHeight: "80px" }} />
                </div>
              </div>
            </div>

            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>📦 Product & Shipment Information</h2>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date of Shipment *</label>
                  <input type="date" name="shipmentDate" value={formData.shipmentDate} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Invoice Number *</label>
                  <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Invoice Value (INR) *</label>
                  <input type="number" name="invoiceValue" value={formData.invoiceValue} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Product / Grade *</label>
                  <input type="text" name="productGrade" value={formData.productGrade} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>CI No.</label>
                  <input type="text" name="ciNo" value={formData.ciNo} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Production Batch *</label>
                  <input type="text" name="productionBatch" value={formData.productionBatch} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Quantity (kg) *</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Packaging Type</label>
                  <input type="text" name="packagingType" value={formData.packagingType} onChange={handleChange} style={styles.input} />
                </div>
              </div>
            </div>

            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>📞 Response Tracking</h2>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>First Response Date (Sales)</label>
                  <input type="date" name="firstResponseSales" value={formData.firstResponseSales} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>First Response Date (Plant)</label>
                  <input type="date" name="firstResponsePlant" value={formData.firstResponsePlant} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Stakeholders</label>
                  <input type="text" name="stakeholders" value={formData.stakeholders} onChange={handleChange} placeholder="e.g. Sales / QC" style={styles.input} />
                </div>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button type="button" onClick={handleReset} style={styles.btnSecondary} disabled={loading}>Clear Form</button>
              <button type="submit" style={styles.btnPrimary} disabled={loading}>
                {loading ? "Processing..." : "Create Complaint →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  body: { backgroundColor: "#f5f7fa", minHeight: "100vh" },
  container: {  },
  content: { padding: "40px" },
  formSection: { marginBottom: "30px" },
  sectionTitle: { color: "#667eea", fontSize: "19px", marginBottom: "15px", borderBottom: "2px solid #667eea", paddingBottom: "5px", fontWeight: "bold" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontWeight: 600, fontSize: "14px", color: "#4a5568" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px", outline: "none" },
  inputReadOnly: { padding: "10px", backgroundColor: "#edf2f7", border: "1px solid #ddd", borderRadius: "5px", color: "#4a5568", fontWeight: "bold" },
  buttonGroup: { display: "flex", justifyContent: "flex-end", gap: "15px", borderTop: "1px solid #eee", paddingTop: "20px", marginBottom: "40px" },
  btnPrimary: { padding: "12px 25px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  btnSecondary: { padding: "12px 25px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    backdropFilter: "blur(2px)"
  }
};

export default CreateComplaint;