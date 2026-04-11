import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { PlusCircle } from 'lucide-react';

const ReportsList = () => {
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
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Reports</h1>
        {user.role === 'employee' && (
          <Link to="/reports/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} /> New Report
          </Link>
        )}
      </div>

      <div className="card">
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0' }}>Report Name</th>
                <th>Month</th>
                <th>Employee</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0' }}>{r.name}</td>
                  <td>{r.month_year}</td>
                  <td>{r.user?.name || user.name}</td>
                  <td>${r.total_amount}</td>
                  <td style={{ textTransform: 'capitalize' }}>{r.status.replace('_', ' ')}</td>
                  <td>
                    <Link to={`/reports/${r._id}`} style={{ color: 'var(--color-primary-dark)', fontWeight: '500' }}>View Details</Link>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsList;
