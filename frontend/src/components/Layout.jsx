import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, PieChart, LogOut, Tags } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* 3D Glassmorphism Sidebar */}
      <nav className="sidebar">
        <h2 style={{ marginBottom: '2.5rem', color: 'var(--color-primary-dark)', letterSpacing: '0.05em' }}>
          {user?.company || 'Expensor'}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: 0 }}>
          <Link to="/dashboard" className="nav-item">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/reports" className="nav-item">
            <FileText size={20} /> Reports
          </Link>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <>
              <Link to="/users" className="nav-item">
                <Users size={20} /> Manage Team
              </Link>
              <Link to="/categories" className="nav-item">
                <Tags size={20} /> Categories
              </Link>
            </>
          )}
          <Link to="/analytics" className="nav-item">
            <PieChart size={20} /> Analytics
          </Link>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <div style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'}}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                 Logged in as<br/><strong style={{color: 'var(--text-main)'}}>{user?.name}</strong>
               </p>
               <ThemeToggle />
             </div>
             <button onClick={handleLogout} className="btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', border: '1px solid var(--color-alert-red)', background: 'transparent' }}>
               <LogOut size={16} /> Logout
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--color-primary-dark)' }}>Expense System</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user?.email}</span>
          </div>
        </header>

        {/* Nested View */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
