import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import AddExpenseForm from '../components/AddExpenseForm';

const ReportDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Rejection reason state
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      // Find report from array or endpoint if we had one. Since we don't have GET /reports/:id,
      // we can fetch all and filter, or just add a quick endpoint.
      // Wait, we have GET /reports. Let's just fetch it.
      const { data: reports } = await api.get('/reports');
      const rep = reports.find(r => r._id === id);
      setReport(rep);

      if (rep) {
        const { data: exps } = await api.get(`/expenses?reportId=${id}`);
        setExpenses(exps);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
       await api.patch(`/reports/${id}/status`, { 
           status: newStatus,
           rejection_reason: newStatus.includes('rejected') ? rejectionReason : null
       });
       setShowRejectForm(false);
       fetchReportDetails();
    } catch(err) {
       alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!report) return <p>Report not found. You might not have access.</p>;

  // Check if owner can edit
  const canEdit = report.user._id === user._id && ['draft', 'manager_rejected', 'admin_rejected'].includes(report.status);
  // Check if manager can approve
  const managerCanApprove = user.role === 'manager' && report.status === 'pending' && report.manager?._id === user._id && report.user._id !== user._id;
  // Admin approval
  const adminCanApprove = user.role === 'admin' && (report.status === 'manager_approved' || report.status === 'pending') && report.user._id !== user._id;

  const handleDeleteExpense = async (expenseId) => {
    if(!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
        await api.delete(`/expenses/${expenseId}`);
        fetchReportDetails();
    } catch (err) {
        alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {report.name}
            <span style={{ fontSize: '1rem', padding: '4px 12px', background: 'var(--bg-main)', borderRadius: '16px', color: 'var(--text-muted)' }}>
               {report.status.replace('_', ' ').toUpperCase()}
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Month: {report.month_year} | Total: ${report.total_amount}</p>
          {report.rejection_reason && (
             <p style={{ color: 'var(--color-alert-red)', fontWeight: '500', marginTop: '0.5rem' }}>
               Manager/Admin Note: {report.rejection_reason}
             </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
           {canEdit && (
               <button className="btn" style={{ background: 'var(--color-primary)', color: '#fff' }} onClick={() => handleStatusUpdate('pending')}>
                  Submit Report
               </button>
           )}
           {managerCanApprove && (
             <>
               <button className="btn" style={{ background: 'green', color: '#fff' }} onClick={() => handleStatusUpdate('manager_approved')}>Approve (Manager)</button>
               <button className="btn btn-danger" onClick={() => setShowRejectForm(true)}>Reject</button>
             </>
           )}
           {adminCanApprove && (
             <>
               <button className="btn" style={{ background: 'darkgreen', color: '#fff' }} onClick={() => handleStatusUpdate('admin_approved')}>Final Approve (Admin)</button>
             </>
           )}
           {report.status === 'admin_approved' && user.role === 'admin' && (
               <button className="btn" style={{ background: 'blue', color: '#fff' }} onClick={() => handleStatusUpdate('reimbursed')}>Mark Reimbursed</button>
           )}
        </div>
      </div>

      {showRejectForm && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--color-alert-red)' }}>
           <h4 style={{ color: 'var(--color-alert-red)' }}>Rejecting Report</h4>
           <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Provide reason for rejection (required)</label>
              <textarea className="form-control" rows="3" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}></textarea>
           </div>
           <button className="btn btn-danger" onClick={() => handleStatusUpdate(user.role === 'admin' ? 'admin_rejected' : 'manager_rejected')}>Confirm Rejection</button>
           <button className="btn" style={{ background: 'transparent', color: 'var(--text-main)' }} onClick={() => setShowRejectForm(false)}>Cancel</button>
        </div>
      )}

      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No expenses added to this report yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
           {expenses.map(exp => (
              <div key={exp._id} className="card" style={{ borderLeft: exp.warnings.length > 0 ? '4px solid var(--color-alert-red)' : '4px solid var(--border-color)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h4 style={{ color: 'var(--color-primary-dark)' }}>{exp.category?.name || 'Unknown'}</h4>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--color-accent-rose)' }}>${exp.amount}</strong>
                 </div>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Date: {new Date(exp.date).toLocaleDateString()}</p>
                 
                 {exp.warnings.length > 0 && (
                   <div style={{ background: '#ffebee', color: 'darkred', padding: '6px', fontSize: '0.8rem', marginTop: '10px', borderRadius: '4px' }}>
                     <strong>Warning: </strong> {exp.warnings[0]}
                   </div>
                 )}
                 
                 {!exp.category && (
                   <div style={{ background: '#ffebee', color: 'darkred', padding: '6px', fontSize: '0.8rem', marginTop: '10px', borderRadius: '4px' }}>
                     <strong>Warning: </strong> This category does not exist any longer. Please delete this expense or update it if possible.
                   </div>
                 )}

                 {exp.details && Object.keys(exp.details).length > 0 && (
                   <div style={{ marginTop: '10px', padding: '10px', background: 'var(--bg-main)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Details:</p>
                      {Object.entries(exp.details).map(([k, v]) => (
                         <div key={k} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                            <span>{v}</span>
                         </div>
                      ))}
                   </div>
                 )}

                 {exp.bill_image_url && (
                    <div style={{ marginTop: '10px' }}>
                       <a href={`http://localhost:5001${exp.bill_image_url}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', textDecoration: 'underline' }}>View Receipt</a>
                    </div>
                 )}
                 {canEdit && (
                    <button className="btn btn-danger" style={{ marginTop: '10px', padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleDeleteExpense(exp._id)}>
                       Delete Expense
                    </button>
                 )}
              </div>
           ))}
        </div>
      )}

      {canEdit && !showAddForm && (
        <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => setShowAddForm(true)}>+ Add Expense</button>
      )}

      {showAddForm && (
        <AddExpenseForm reportId={id} 
                        onCancel={() => setShowAddForm(false)} 
                        onExpenseAdded={() => { setShowAddForm(false); fetchReportDetails(); }} />
      )}

    </div>
  );
};

export default ReportDetails;
