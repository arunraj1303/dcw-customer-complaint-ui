import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompliants, getCompliant, updateComplaint } from "../api/apiService";
import Header from "../component/Header";
import Loading from "../component/Loading"; // Import Loading
import SuccessToast from "../component/SuccessToast"; // Import SuccessToast

const IssueIdentification: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // UI Feedback States
  const [pageLoading, setPageLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    rootCause: "",
    rootCauseDetail: "",
    correctiveAction: "",
    correctiveActionDetail: "", 
    correctiveActionDate: "",
    responsiblePerson: "",       
    status: "",           
    expectedClosure: "",         
    notes: ""                     
  });

  const fetchTableData = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getCompliants(filters);
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching table:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleActionClick = async (id: string) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const data = await getCompliant(id);
      setSelectedDetails(data);
      
      setFormData({
        rootCause: data.rootCause || "",
        rootCauseDetail: data.rootCauseDetail || "",
        correctiveAction: data.correctiveAction || "",
        correctiveActionDetail: data.correctiveActionDetail || "",
        correctiveActionDate: data.correctiveActionDate ? data.correctiveActionDate.split('T')[0] : "",
        responsiblePerson: data.responsiblePerson || "",
        status: data.status || "Open", 
        expectedClosure: data.expectedClosure ? data.expectedClosure.split('T')[0] : "",
        notes: data.notes || ""
      });
    } catch (err) {
      console.error("Error fetching detail:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageLoading(true); // Start Overlay Loading

    const id = selectedDetails.complaintId; 
    const payload: any = {};
    Object.keys(formData).forEach((key) => {
      payload[key] = formData[key as keyof typeof formData] === "" ? null : formData[key as keyof typeof formData];
    });

    try {
      await updateComplaint(id, payload);
      setToastMsg("Analysis Saved Successfully! ✅");
      setShowToast(true);
      
      setIsModalOpen(false);
      // Refresh table with current filters
      fetchTableData({search: searchId, status: filterStatus}); 
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setPageLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDetails(null);
  };

  return (
    <div style={styles.body}>
      {/* 1. Success Toast (Top Right) */}
      <SuccessToast 
        show={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
      />

      {/* 2. Global Loading Overlay */}
      {pageLoading && (
        <div style={styles.loadingOverlay}>
          <Loading message="Updating Complaint Status..." />
        </div>
      )}

      <div style={styles.container}>
       <Header/>

        <div style={styles.content}>
          <div style={styles.searchSection}>
            <div style={styles.searchGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Search by Complaint ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. CMP-00001"
                  style={styles.input} 
                  value={searchId} 
                  onChange={(e) => setSearchId(e.target.value)} 
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Filter by Status</label>
                <select style={styles.input} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <button style={styles.btnPrimary} onClick={() => fetchTableData({search: searchId, status: filterStatus})}>Search</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Complaint ID</th>
                  <th style={styles.th}>Customer Name</th>
                  <th style={styles.th}>Product/Grade</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Severity</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan={8} style={{textAlign: 'center', padding: '20px'}}><Loading message="Fetching Table Data..."/></td></tr>
                ) : complaints.map((item, index) => (
                  <tr key={item.complaintId} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{item.complaintId}</td>
                    <td style={styles.td}>{item.customerName}</td>
                    <td style={styles.td}>{item.productGrade}</td>
                    <td style={styles.td}>{item.complaintDate ? new Date(item.complaintDate).toLocaleDateString() : 'N/A'}</td>
                    <td style={{...styles.td, color: item.complaintSeverity === 'High' ? '#dc3545' : '#fd7e14', fontWeight: 'bold'}}>{item.complaintSeverity}</td>
                    <td style={styles.td}>
                        <span style={item.status === 'Open' ? styles.statusOpen : styles.statusInvestigating}>
                            {item.status}
                        </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn} onClick={() => handleActionClick(item.complaintId)}>Identify Issue</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal - Issue Analysis Form */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {modalLoading ? <Loading message="Loading Complaint History..."/> : (
              <>
                <div style={styles.modalHeader}>
                  <h2 style={{color: '#667eea', margin: 0}}>🔬 Issue Identification & Root Cause</h2>
                  <span style={styles.closeBtn} onClick={closeModal}>&times;</span>
                </div>

                <div style={styles.infoCard}>
                  <div style={styles.infoRow}><span style={styles.infoLabel}>Complaint ID:</span> <span>{selectedDetails?.complaintId}</span></div>
                  <div style={styles.infoRow}><span style={styles.infoLabel}>Customer Name:</span> <span>{selectedDetails?.customerName}</span></div>
                  <div style={styles.infoRow}><span style={styles.infoLabel}>Description:</span> <span>{selectedDetails?.complaintDescription}</span></div>
                </div>

                <form onSubmit={handleIssueSubmit}>
                  {/* RCA Section */}
                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>🎯 Root Cause Analysis</h3>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Root Cause *</label>
                        <select name="rootCause" value={formData.rootCause} onChange={handleInputChange} required style={styles.inputFull}>
                        <option value="">Select Root Cause</option>
                        <option value="Production process deviation">Production process deviation</option>
                        <option value="Raw material quality issue">Raw material quality issue</option>
                        <option value="Human error">Human error</option>
                        </select>
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <label style={styles.label}>Detailed Description</label>
                        <textarea name="rootCauseDetail" value={formData.rootCauseDetail} onChange={handleInputChange} style={styles.textArea} />
                    </div>
                  </div>

                  {/* Action Section */}
                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>✅ Corrective Action</h3>
                    <div style={styles.formGrid}>
                       <div style={styles.formGroup}>
                          <label style={styles.label}>Action Date *</label>
                          <input type="date" name="correctiveActionDate" value={formData.correctiveActionDate} onChange={handleInputChange} required style={styles.input} />
                       </div>
                       <div style={styles.formGroup}>
                          <label style={styles.label}>Responsible Person</label>
                          <input type="text" name="responsiblePerson" value={formData.responsiblePerson} onChange={handleInputChange} style={styles.input} />
                       </div>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>📊 Status Update</h3>
                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Current Status *</label>
                        <select name="status" value={formData.status} onChange={handleInputChange} required style={styles.input}>
                          <option value="Open">Open</option>
                          <option value="Investigating">Investigating</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={styles.buttonGroup}>
                    <button type="button" onClick={closeModal} style={styles.btnSecondary} disabled={pageLoading}>Cancel</button>
                    <button type="submit" style={styles.btnPrimary} disabled={pageLoading}>
                      {pageLoading ? "Saving..." : "Save & Continue →"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  body: { minHeight: '100vh', backgroundColor: '#f5f7fa' },
  container: { },
  content: { padding: "30px" },
  searchSection: { background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "30px" },
  searchGrid: { display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "15px", alignItems: "end" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontWeight: "bold", fontSize: "14px", color: "#333" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "4px", outline: "none" },
  inputFull: { padding: "10px", border: "1px solid #ddd", borderRadius: "4px", width: "100%", outline: "none" },
  textArea: { padding: "10px", border: "1px solid #ddd", borderRadius: "4px", width: "100%", minHeight: "80px", outline: "none" },
  btnPrimary: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", padding: "12px 25px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
  btnSecondary: { background: "#95a5a6", color: "white", border: "none", padding: "12px 25px", borderRadius: "4px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeadRow: { background: "#667eea", color: "white" },
  th: { padding: "12px", textAlign: "left" },
  td: { padding: "12px", borderBottom: "1px solid #eee" },
  tr: { transition: "background 0.3s" },
  statusOpen: { background: "#fff3cd", color: "#856404", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  statusInvestigating: { background: "#cfe2ff", color: "#084298", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  actionBtn: { background: "#667eea", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { background: "white", padding: "40px", borderRadius: "8px", width: "90%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  closeBtn: { fontSize: "28px", cursor: "pointer", color: "#999" },
  infoCard: { background: "#f8f9fa", padding: "20px", borderRadius: "6px", marginBottom: "25px" },
  infoRow: { display: "grid", gridTemplateColumns: "180px 1fr", gap: "10px", padding: "8px 0", borderBottom: "1px solid #dee2e6" },
  infoLabel: { fontWeight: "bold", color: "#495057" },
  sectionTitle: { color: "#667eea", fontSize: "18px", borderBottom: "2px solid #667eea", paddingBottom: "10px", marginBottom: "15px", marginTop: "20px" },
  formSection: { marginBottom: "25px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "10px" },
  buttonGroup: { display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" },
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

export default IssueIdentification;