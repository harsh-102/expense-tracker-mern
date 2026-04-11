import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} 
            className="btn btn-icon" 
            style={{ 
               background: 'var(--card-bg)', 
               color: 'var(--text-main)', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center',
               borderRadius: '50%',
               width: '40px',
               height: '40px',
               padding: 0,
               border: '1px solid var(--border-color)',
               boxShadow: 'var(--shadow-sm)'
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
