import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const BACKGROUND_IMAGES = [
  //'https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop'
];

const Signup = () => {
  const [formData, setFormData] = useState({ companyName: '', userName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [bgImage, setBgImage] = useState('');
  const { signupAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const randomImg = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
    setBgImage(randomImg);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupAdmin(formData.companyName, formData.userName, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: bgImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})` : 'var(--bg-main)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>Register Company</h2>
        {error && <div style={{ color: 'var(--color-alert-red)', background: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" className="form-control" required
              value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Admin Name</label>
            <input type="text" className="form-control" required
              value={formData.userName} onChange={e => setFormData({ ...formData, userName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Admin Email</label>
            <input type="email" className="form-control" required
              value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" required minLength="6"
              value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
