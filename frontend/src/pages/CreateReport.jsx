import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateReport = () => {
  const [name, setName] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/reports', { name, month_year: monthYear });
      navigate(`/reports/${data._id}`); // Redirect to empty report details to add expenses
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Create New Report</h1>
      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div style={{ color: 'var(--color-alert-red)', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Report Name</label>
            <input type="text" className="form-control" required placeholder="e.g. Q4 Business Trip to LA"
                   value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Month / Year</label>
            <input type="month" className="form-control" required
                   value={monthYear} onChange={e => setMonthYear(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Report Scaffold</button>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
