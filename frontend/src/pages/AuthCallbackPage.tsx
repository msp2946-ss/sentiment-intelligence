import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthToken } from '../utils/auth';

const COOKIE_POPUP_PENDING_KEY = 'sentiai_cookie_popup_pending';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get('token');
  const error = params.get('error');
  const nextPath = params.get('next') || '/';

  const sanitizedNext = useMemo(() => {
    if (!nextPath.startsWith('/')) {
      return '/';
    }
    return nextPath;
  }, [nextPath]);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      localStorage.setItem(COOKIE_POPUP_PENDING_KEY, '1');
      window.dispatchEvent(new Event('auth-changed'));
      window.dispatchEvent(new Event('open-cookie-consent'));
      navigate(sanitizedNext, { replace: true });
      return;
    }

    const target = error ? `/login?error=${encodeURIComponent(error)}` : '/login?error=Login failed';
    navigate(target, { replace: true });
  }, [error, navigate, sanitizedNext, token]);

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 min-h-[60vh] flex items-center justify-center">
      <p className="text-muted-foreground">Completing login...</p>
    </section>
  );
}
