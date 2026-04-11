import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const ManageUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'employee', employee_id: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      setFormData({ name: '', email: '', role: 'employee', employee_id: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (user?.role === 'employee') return <p>Unauthorized</p>

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Manage Team</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Invite New Member</h3>
        {error && <div style={{ color: 'darkred', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'end', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Name</label>
            <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Email</label>
            <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Role</label>
            <select className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="employee">Employee</option>
              {user.role === 'admin' && <option value="manager">Manager</option>}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Employee ID</label>
            <input type="text" className="form-control" value={formData.employee_id} onChange={e => setFormData({ ...formData, employee_id: e.target.value })} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Designated Manager</label>
            <select className="form-control" value={formData.manager_id || ''} onChange={e => setFormData({ ...formData, manager_id: e.target.value })}>
              <option value="">None (Admin serves as manager)</option>
              {users.filter(u => u.role === 'manager' || u.role === 'admin').map(m => (
                 <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit" style={{ flex: '0 0 auto', marginBottom: '1rem' }}>Add User</button>
        </form>
      </div>

      <div className="card">
        <h3>Team Directory</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0' }}>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Manager</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>{u.name} {u.employee_id && `(${u.employee_id})`}</td>
                <td>{u.email}</td>
                <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                <td><span style={{ color: u.isActive ? 'green' : 'orange' }}>{u.isActive ? 'Active' : 'Pending Invite'}</span></td>
                <td>{u.manager?.name || 'Self/Admin'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
