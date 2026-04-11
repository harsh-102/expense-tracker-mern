import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Layout & Pages
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ReportsList from './pages/ReportsList';
import CreateReport from './pages/CreateReport';
import ReportDetails from './pages/ReportDetails';
import ManageUsers from './pages/ManageUsers';
import ManageCategories from './pages/ManageCategories';
import Analytics from './pages/Analytics';
import CustomCursor from './components/CustomCursor';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <CustomCursor />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes directly rendering Layout with nested Outlet */}
      {user && (
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<ReportsList />} />
          <Route path="/reports/new" element={<CreateReport />} />
          <Route path="/reports/:id" element={<ReportDetails />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/categories" element={<ManageCategories />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      )}

      {/* Wildcard to catch all other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
