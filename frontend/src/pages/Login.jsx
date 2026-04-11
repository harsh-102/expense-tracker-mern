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

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  
  // States handling employee initial activation
  const [isInactive, setIsInactive] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [bgImage, setBgImage] = useState('');

  const { login, activateAccount } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const randomImg = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
    setBgImage(randomImg);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.isInactive) {
        setIsInactive(true);
        setError("Account inactive. Please activate your account by setting a new password.");
      } else {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  const handleActivation = async (e) => {
    e.preventDefault();
    try {
      await activateAccount(formData.email, newPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

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
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>Login to Expensor</h2>
        {error && <div style={{ color: 'var(--color-alert-red)', background: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
        
        {!isInactive ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" required 
                     value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Password (Leave blank if activating)</label>
              <input type="password" className="form-control" 
                     value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
          </form>
        ) : (
          <form onSubmit={handleActivation}>
            <p style={{marginBottom: '1rem', color: '#666'}}>Welcome! Since this is your first time logging in, please set a password for your account.</p>
            <div className="form-group">
              <label>Set New Password</label>
              <input type="password" className="form-control" required minLength="6"
                     value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '1rem' }}>Set Password & Activate</button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Is your company new? <Link to="/signup">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
