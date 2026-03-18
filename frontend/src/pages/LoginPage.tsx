import { motion } from 'motion/react';
import { Github } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';
import { buildApiUrl, getAuthToken } from '../utils/auth';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C17 3.6 14.7 2.6 12 2.6 6.9 2.6 2.8 6.7 2.8 11.8s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.2-1.9H12z"
      />
    </svg>
  );
}

export function LoginPage() {
  const location = useLocation();
  const token = getAuthToken();
  const fromState = location.state as { from?: string } | null;
  const next = fromState?.from && fromState.from.startsWith('/') ? fromState.from : '/';

  if (token) {
    return <Navigate to="/" replace />;
  }

  const googleLoginUrl = buildApiUrl(`/api/auth/google/login?next=${encodeURIComponent(next)}`);
  const githubLoginUrl = buildApiUrl(`/api/auth/github/login?next=${encodeURIComponent(next)}`);

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 min-h-[70vh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-2xl p-8 shadow-xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Secure Login</h1>
          <p className="text-muted-foreground mb-8">
            Continue with Google or GitHub to access sentiment analysis and support features.
          </p>

          <div className="space-y-4">
            <a
              href={googleLoginUrl}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-border/60 bg-background hover:bg-secondary/60 transition-colors font-medium"
            >
              <GoogleIcon />
              Continue with Google
            </a>

            <a
              href={githubLoginUrl}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
