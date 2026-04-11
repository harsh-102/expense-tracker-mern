import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { PlusCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/reports');
      setReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const approvedCount = reports.filter(r => r.status.includes('approved')).length;

  // Dashboard Sections based on role
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Welcome Back, {user.name}</h1>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Clock size={32} color="var(--color-primary-dark)" />
          <h2 style={{ fontSize: '2.5rem', margin: '1rem 0 0 0' }}>{pendingCount}</h2>
          <p>Pending Reports</p>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckCircle size={32} color="var(--color-success)" />
          <h2 style={{ fontSize: '2.5rem', margin: '1rem 0 0 0' }}>{approvedCount}</h2>
          <p>Approved Reports</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Quick Actions</h2>
        <Link to="/reports/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20} /> Create New Report
        </Link>
      </div>

      <div className="card">
        <h3>{user.role === 'employee' ? 'Your Recent Reports' : 'Reports Requiring Review'}</h3>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0' }}>Report Name</th>
                <th>Month</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 5).map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0' }}>{r.name}</td>
                  <td>{r.month_year}</td>
                  <td>${r.total_amount}</td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      background: r.status.includes('rejected') ? 'rgba(239, 68, 68, 0.1)' : r.status.includes('approved') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: r.status.includes('rejected') ? 'var(--color-alert-red)' : r.status.includes('approved') ? 'var(--color-success)' : 'orange'
                    }}>
                      {r.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <Link to={`/reports/${r._id}`} style={{ color: 'var(--color-primary-dark)', fontWeight: '500' }}>View</Link>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No recent reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
