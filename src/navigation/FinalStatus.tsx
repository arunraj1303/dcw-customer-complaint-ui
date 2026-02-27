import React, { useEffect, useState } from "react";
import { getCompliants, getCompliant, getCompliantsCount } from "../api/apiService";
import Header from "../component/Header";
import Loading from "../component/Loading";
import SuccessToast from "../component/SuccessToast";

const FinalStatus: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [stats, setStats] = useState({
    totalComplaints: 0,
    closeComplaints: 0,
    openComplaints: 0,
    avgResolution: "24 days"
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);

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
    } catch (err) { console.error(err); } 
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
    } catch (err) { console.error(err); }
    finally { setModalLoading(false); }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDetails(null);
  };

  return (
    <div style={styles.body}>
      <SuccessToast show={showToast} message="Exporting Data..." onClose={() => setShowToast(false)} />
      
      <div style={styles.container}>
        <Header />

        <div style={styles.content}>
          {/* Dashboard Stats (Matching HTML Colors) */}
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
                <label style={styles.label}>Search ID / Customer</label>
                <input style={styles.input} placeholder="Enter Search term..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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

          {/* 12 Column Table */}
          <div style={{ overflowX: "auto", background: 'white', borderRadius: '8px' }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ background: "#667eea", color: "white" }}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Complaint ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Severity</th>
                  <th style={styles.th}>Root Cause</th>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Closed Date</th>
                  <th style={styles.th}>Res. Time</th>
                  <th style={styles.th}>Detail</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={12} style={{textAlign: 'center', padding: '40px'}}><Loading message="Loading Data..."/></td></tr>
                ) : (
                  filteredComplaints.map((c, index) => (
                    <tr key={c.complaintId} style={styles.tr}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}><strong>{c.complaintId}</strong></td>
                      <td style={styles.td}>{c.customerName}</td>
                      <td style={styles.td}>{c.productGrade}</td>
                      <td style={styles.td}>{c.complaintDate}</td>
                      <td style={{...styles.td, color: c.complaintSeverity === 'High' ? '#dc3545' : '#fd7e14', fontWeight: 'bold'}}>{c.complaintSeverity}</td>
                      <td style={styles.td}>{c.rootCause || "---"}</td>
                      <td style={styles.td}>{c.correctiveAction || "---"}</td>
                      <td style={styles.td}>
                        <span style={c.status?.toLowerCase() === 'closed' ? styles.statusClosed : styles.statusOpen}>
                            {c.status}
                        </span>
                      </td>
                      <td style={styles.td}>{c.status?.toLowerCase() === 'closed' ? (c.updatedAt?.split('T')[0] || c.closedDate) : "-"}</td>
                      <td style={styles.td}>
                         <span style={{...styles.timeBadge, backgroundColor: c.status?.toLowerCase() === 'closed' ? '#d1e7dd' : '#fff3cd'}}>
                            {c.status?.toLowerCase() === 'closed' ? "24 Days" : "Ongoing"}
                         </span>
                      </td>
                      <td style={styles.td}><button style={styles.actionBtn} onClick={() => openDetails(c.complaintId)}>View</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL (HTML structure complete-ah inge irukku) --- */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {modalLoading ? <Loading message="Opening Report..." /> : (
              <>
                <div style={styles.modalHeader}>
                  <h2 style={{color: '#667eea', fontSize: '24px'}}>📄 Full Complaint Details</h2>
                  <span style={styles.closeBtn} onClick={closeModal}>&times;</span>
                </div>

                {/* Section 1: Customer Info */}
                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>👤 Section 1: Customer & Complaint Information</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Complaint ID</div><div style={styles.detailValue}>{selectedDetails?.complaintId}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Customer Name</div><div style={styles.detailValue}>{selectedDetails?.customerName}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Customer Type</div><div style={styles.detailValue}>{selectedDetails?.customerType}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Complaint Date</div><div style={styles.detailValue}>{selectedDetails?.complaintDate}</div></div>
                    <div style={{...styles.detailItem, gridColumn: '1 / -1'}}><div style={styles.detailLabel}>Complaint Description</div><div style={styles.detailValue}>{selectedDetails?.complaintDescription}</div></div>
                  </div>
                </div>

                {/* Section 2: Product & Shipment */}
                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>📦 Section 2: Product & Shipment Details</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Product / Grade</div><div style={styles.detailValue}>{selectedDetails?.productGrade}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Batch Number</div><div style={styles.detailValue}>{selectedDetails?.productionBatch}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Invoice Number</div><div style={styles.detailValue}>{selectedDetails?.invoiceNumber}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Quantity</div><div style={styles.detailValue}>{selectedDetails?.quantity} Kg</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Shipment Date</div><div style={styles.detailValue}>{selectedDetails?.shipmentDate}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Packaging Type</div><div style={styles.detailValue}>{selectedDetails?.packagingType}</div></div>
                  </div>
                </div>

                {/* Section 3: Root Cause & Action (Identification page data) */}
                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>🔍 Section 3: Analysis & Corrective Actions</h3>
                  <div style={styles.detailGrid}>
                    <div style={{...styles.detailItem, gridColumn: '1 / -1'}}><div style={styles.detailLabel}>Root Cause Identified</div><div style={styles.detailValue}>{selectedDetails?.rootCause || "Under Analysis"}</div></div>
                    <div style={{...styles.detailItem, gridColumn: '1 / -1'}}><div style={styles.detailLabel}>Detailed Root Cause Analysis</div><div style={styles.detailValue}>{selectedDetails?.rootCauseDetail || "No details provided."}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Action Taken</div><div style={styles.detailValue}>{selectedDetails?.correctiveAction || "Pending"}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Action Date</div><div style={styles.detailValue}>{selectedDetails?.correctiveActionDate || "---"}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Responsible Person</div><div style={styles.detailValue}>{selectedDetails?.responsiblePerson || "---"}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Expected Closure</div><div style={styles.detailValue}>{selectedDetails?.expectedClosure || "---"}</div></div>
                  </div>
                </div>

                {/* Section 4: Response Timeline */}
                <div style={styles.detailSection}>
                  <h3 style={styles.sectionTitle}>🕒 Section 4: Resolution Tracking</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>First Response (Sales)</div><div style={styles.detailValue}>{selectedDetails?.firstResponseSales || "---"}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>First Response (Plant)</div><div style={styles.detailValue}>{selectedDetails?.firstResponsePlant || "---"}</div></div>
                    <div style={styles.detailItem}><div style={styles.detailLabel}>Final Status</div><div style={{...styles.detailValue, color: '#667eea'}}>{selectedDetails?.status}</div></div>
                    <div style={{...styles.detailItem, gridColumn: '1 / -1'}}><div style={styles.detailLabel}>Additional Notes</div><div style={styles.detailValue}>{selectedDetails?.notes || "No notes available."}</div></div>
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

// Precisely matching your HTML design
const styles: { [key: string]: React.CSSProperties } = {
  body: { backgroundColor: "#f5f7fa", minHeight: '100vh' },
  container: { },
  content: { padding: "40px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "30px" },
  statCard: { padding: "25px", borderRadius: "8px", color: "white", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)" },
  statLabel: { fontSize: "14px", opacity: 0.9, marginBottom: "10px" },
  statValue: { fontSize: "32px", fontWeight: "bold" },
  searchSection: { background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "30px" },
  searchGrid: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr auto", gap: "15px", alignItems: "end" },
  formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontWeight: "bold", fontSize: "14px", color: "#333" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" },
  btnPrimary: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", padding: "12px 30px", borderRadius: "4px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "12px" },
  th: { padding: "12px 8px", textAlign: "left", background: "#667eea", color: "white" },
  td: { padding: "12px 8px", borderBottom: "1px solid #eee" },
  tr: { transition: "background 0.3s" },
  statusClosed: { background: "#d1e7dd", color: "#0f5132", padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  statusOpen: { background: "#fff3cd", color: "#856404", padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" },
  timeBadge: { padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" },
  actionBtn: { padding: "6px 12px", background: "#667eea", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { background: "white", padding: "40px", borderRadius: "8px", width: "95%", maxWidth: "900px", maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  closeBtn: { fontSize: "30px", cursor: "pointer", color: "#999" },
  detailSection: { marginBottom: "30px" },
  sectionTitle: { color: "#667eea", borderBottom: "2px solid #667eea", paddingBottom: "10px", marginBottom: "15px", fontWeight: "bold", fontSize: "18px" },
  detailGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" },
  detailItem: { padding: "10px", background: "#f8f9fa", borderRadius: "4px" },
  detailLabel: { fontSize: "12px", color: "#6c757d", marginBottom: "5px" },
  detailValue: { fontWeight: "bold", fontSize: "14px", color: "#212529" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "30px", borderTop: "1px solid #dee2e6", paddingTop: "20px" },
  btnSecondary: { background: "#6c757d", color: "white", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" },
  btnSuccess: { background: "#28a745", color: "white", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer" }
};

export default FinalStatus;