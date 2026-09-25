import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Guards the application shell. Unauthenticated visitors are redirected to
 * /login (remembering where they were headed) and sent back after login.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-genie-off dark:bg-ink-950">
        <p className="text-sm font-semibold text-genie-blue">Restoring your session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
