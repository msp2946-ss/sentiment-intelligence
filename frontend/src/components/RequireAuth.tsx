import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
