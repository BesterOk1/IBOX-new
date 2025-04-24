import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="dashboard">
      <nav>
        <Link to="/dashboard/courses" className={location.pathname.includes('courses') ? 'active' : ''}>
          Курсы
        </Link>
        <Link to="/dashboard/progress" className={location.pathname.includes('progress') ? 'active' : ''}>
          Прогресс
        </Link>
        <Link to="/dashboard/profile" className={location.pathname.includes('profile') ? 'active' : ''}>
          Профиль
        </Link>
        {currentUser.role === 'admin' && (
          <Link to="/admin-panel">Админ панель</Link>
        )}
        <button onClick={logout}>Выйти</button>
      </nav>
      
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
