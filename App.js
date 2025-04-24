import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
