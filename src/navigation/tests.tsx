import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompliants, getCompliant, getCompliantsCount } from "../api/apiService";
import Header from "../component/Header";

const FinalStatus: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState(""); 

  // Stats State
  const [stats, setStats] = useState({
    totalComplaints: 0,
    closeComplaints: 0,
    openComplaints: 0,
    avgResolution: "24 days"
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [tableData, statsData] = await Promise.all([
        getCompliants(),
        getCompliantsCount()
      ]);
      setComplaints(tableData);
      setFilteredComplaints(tableData);
      setStats(statsData);
    } catch (err) { console.error("Fetch error:", err); } 
    finally { setLoading(false); }
  };

  const handleSearch = () => {
    let results = complaints;
    if (searchTerm) {
      results = results.filter(c => 
        c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus) results = results.filter(c => c.status.toLowerCase() === filterStatus.toLowerCase());
    if (filterDate) results = results.filter(c => c.complaintDate === filterDate);
    setFilteredComplaints(results);
  };

  const openDetails = async (id: string) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const data = await getCompliant(id);
      setSelectedDetails(data);
    } catch (err) { console.error("Modal Error:", err); }
    finally { setModalLoading(false); }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDetails(null);
  };

  // Severity Class Helper
  const getSeverityStyle = (severity: string) => {
    if (severity === 'High') return { color: '#dc3545', fontWeight: '600' };
    if (severity === 'Medium') return { color: '#fd7e14', fontWeight: '600' };
    return { color: '#198754', fontWeight: '600' };
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header Section from Template */}
     <Header />

        <div style={styles.content}>
          {/* Statistics Dashboard */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
                <h3 style={styles.statLabel}>📋 Total Complaints</h3>
                <div style={styles.statValue}>{stats.totalComplaints}</div>
            </div>
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'}}>
                <h3 style={styles.statLabel}>✅ Closed</h3>
                <div style={styles.statValue}>{stats.closeComplaints}</div>
            </div>
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                <h3 style={styles.statLabel}>⏳ Open</h3>
                <div style={styles.statValue}>{stats.openComplaints}</div>
            </div>
            <div style={{...styles.statCard, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                <h3 style={styles.statLabel}>⏱️ Avg. Resolution Time</h3>
                <div style={styles.statValue}>{stats.avgResolution}</div>
            </div>
          </div>

          {/* Search Section */}
          <div style={styles.searchSection}>
            <div style={styles.searchGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Search by ID/Customer</label>
                <input style={styles.input} placeholder="Enter complaint ID or customer name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date</label>
                <input type="date" style={styles.input} value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select style={styles.input} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <button style={styles.btnPrimary} onClick={handleSearch}>Search</button>
            </div>
          </div>

          {/* Correctly Mapped Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ background: "#667eea", color: "white" }}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Complaint ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Complaint Date</th>
                  <th style={styles.th}>Severity</th>
                  <th style={styles.th}>Root Cause</th>
                  <th style={styles.th}>Corrective Action</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Closed Date</th>
                  <th style={styles.th}>Resolution Time</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={12} style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
                ) : filteredComplaints.map((c, index) => (
                  <tr key={c.complaintId} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}><strong>{c.complaintId}</strong></td>
                    <td style={styles.td}>{c.customerName}</td>
                    <td style={styles.td}>{c.productGrade}</td>
                    <td style={styles.td}>{c.complaintDate}</td>
                    <td style={{...styles.td, ...getSeverityStyle(c.complaintSeverity)}}>{c.complaintSeverity}</td>
                    <td style={styles.td}>{c.rootCause || "---"}</td>
                    <td style={styles.td}>{c.correctiveAction || "---"}</td>
                    <td style={styles.td}>
                        <span style={c.status.toLowerCase() === "closed" ? styles.statusClosed : styles.statusOpen}>
                            {c.status}
                        </span>
                    </td>
                    <td style={styles.td}>{c.status.toLowerCase() === "closed" ? (c.updatedAt?.split('T')[0] || c.closedDate || "---") : "-"}</td>
                    <td style={styles.td}>
                        <span style={{...styles.timeBadge, backgroundColor: c.status.toLowerCase() === 'closed' ? '#d1e7dd' : '#fff3cd'}}>
                            {c.status.toLowerCase() === "closed" ? "24 days" : "Ongoing"}
                        </span>
                    </td>
                    <td style={styles.td}><button style={styles.actionBtn} onClick={() => openDetails(c.complaintId)}>View Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL DESIGN FROM TEMPLATE --- */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {modalLoading ? <div style={{textAlign: 'center', padding: '50px'}}>Loading Details...</div> : (
              <>
                <div style={styles.modalHeader}>
                  <h2 style={{color: '#667eea', fontSize: '24px'}}>📄 Complaint Complete Details</h2>
                  <span style={styles.closeBtn} onClick={closeModal}>&times;</span>
                </div>

                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>👤 Customer & Complaint Information</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Complaint ID</div><div style={styles.detailValue}>{selectedDetails?.complaintId}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Customer Name</div><div style={styles.detailValue}>{selectedDetails?.customerName}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Complaint Date</div><div style={styles.detailValue}>{selectedDetails?.complaintDate}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Severity</div><div style={{...styles.detailValue, color: '#dc3545'}}>{selectedDetails?.complaintSeverity}</div></div>
                    <div style={{...styles.detailItem, gridColumn: '1 / -1'}}><div style={styles.detailLabel}>Description</div><div style={styles.detailValue}>{selectedDetails?.complaintDescription}</div></div>
                  </div>
                </div>

                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>📦 Product & Shipment Information</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Product / Grade</div><div style={styles.detailValue}>{selectedDetails?.productGrade}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Batch Number</div><div style={styles.detailValue}>{selectedDetails?.productionBatch || "---"}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Invoice No</div><div style={styles.detailValue}>{selectedDetails?.invoiceNumber || "---"}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Quantity</div><div style={styles.detailValue}>{selectedDetails?.quantity || "0"} Kg</div></div>
                  </div>
                </div>

                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>🔍 Root Cause & Action</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Root Cause</div><div style={styles.detailValue}>{selectedDetails?.rootCause || "Under Investigation"}</div></div>
                    <div style={{...styles.detailItem, gridColumn: '1 / -1'}}><div style={styles.detailLabel}>Corrective Action</div><div style={styles.detailValue}>{selectedDetails?.correctiveAction || "Pending"}</div></div>
                  </div>
                </div>

                <div style={styles.modalFooter}>
                  <button style={styles.btnSecondary} onClick={closeModal}>Close</button>
                  <button style={styles.btnSuccess} onClick={() => window.print()}>Print Report</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// CSS-in-JS Styles precisely matching your HTML
const styles: { [key: string]: React.CSSProperties } = {
  body: { backgroundColor: "#f5f7fa"},
  container: { },
  header: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "30px" },
  navLinks: { display: "flex", gap: "10px", marginTop: "20px" },
  navBtn: { background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" },
  content: { padding: "40px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" },
  statCard: { padding: "25px", borderRadius: "8px", color: "white", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)" },
  statLabel: { fontSize: "14px", opacity: 0.9, marginBottom: "10px" },
  statValue: { fontSize: "32px", fontWeight: "bold" },
  searchSection: { background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "30px" },
  searchGrid: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr auto", gap: "20px", alignItems: "end" },
  formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontWeight: "bold", fontSize: "14px", color: "#333" },
  input: { padding: "11px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" },
  btnPrimary: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", padding: "12px 30px", borderRadius: "4px", cursor: "pointer", fontSize: "16px" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: { padding: "12px 8px", textAlign: "left", background: "#667eea", color: "white", fontWeight: "600" },
  td: { padding: "12px 8px", borderBottom: "1px solid #eee" },
  tr: { transition: "background 0.3s" },
  statusClosed: { background: "#d1e7dd", color: "#0f5132", padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", display: "inline-block" },
  statusOpen: { background: "#fff3cd", color: "#856404", padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", display: "inline-block" },
  timeBadge: { padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" },
  actionBtn: { padding: "6px 12px", background: "#667eea", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { background: "white", padding: "40px", borderRadius: "8px", width: "90%", maxWidth: "900px", maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  closeBtn: { fontSize: "30px", cursor: "pointer", color: "#999" },
  detailSection: { marginBottom: "30px" },
  sectionTitle: { color: "#667eea", borderBottom: "2px solid #667eea", paddingBottom: "10px", marginBottom: "15px", fontWeight: "bold", fontSize: "18px" },
  detailGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" },
  detailItem: { padding: "10px", background: "#f8f9fa", borderRadius: "4px" },
  detailLabel: { fontSize: "12px", color: "#6c757d", marginBottom: "5px" },
  detailValue: { fontWeight: "bold", fontSize: "14px", color: "#212529" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #dee2e6" },
  btnSecondary: { background: "#6c757d", color: "white", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" },
  btnSuccess: { background: "#28a745", color: "white", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" }
};

export default FinalStatus;