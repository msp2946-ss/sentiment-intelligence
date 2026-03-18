import { Moon, Sun, Sparkles, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthToken, getAuthToken } from '../utils/auth';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Check initial theme
    const theme = document.documentElement.classList.contains('dark');
    setIsDark(theme);
    setIsAuthenticated(Boolean(getAuthToken()));

    // Handle scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    const handleStorage = () => setIsAuthenticated(Boolean(getAuthToken()));
    const handleAuthChanged = () => setIsAuthenticated(Boolean(getAuthToken()));
    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-changed', handleAuthChanged);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-changed', handleAuthChanged);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" aria-label="Go to home" className="inline-block">
            <motion.div
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-60" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  SentiAI
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground -mt-1 hidden sm:block">
                  Emotion Intelligence
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#demo">Demo</NavLink>
                <NavLink href="#examples">Examples</NavLink>
              </>
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!isHomePage && (
              <Link to="/">
                <motion.button
                  className="hidden md:block px-4 py-2 bg-secondary/60 hover:bg-secondary rounded-xl transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Home
                </motion.button>
              </Link>
            )}

            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </motion.button>

            {isAuthenticated ? (
              <motion.button
                onClick={handleLogout}
                className="hidden md:block px-4 lg:px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            ) : (
              <Link to="/login">
                <motion.button
                  className="hidden md:block px-4 lg:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login / Signup
                </motion.button>
              </Link>
            )}

            <motion.button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex md:hidden p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {isHomePage && (
                <div className="grid grid-cols-3 gap-2">
                  <NavLink href="#features">Features</NavLink>
                  <NavLink href="#demo">Demo</NavLink>
                  <NavLink href="#examples">Examples</NavLink>
                </div>
              )}

              {!isHomePage && (
                <Link to="/" className="block">
                  <button
                    className="w-full px-4 py-2.5 bg-secondary/60 hover:bg-secondary rounded-xl transition-colors text-sm font-medium"
                    type="button"
                  >
                    Home
                  </button>
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-sm font-medium"
                  type="button"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="block">
                  <button
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium"
                    type="button"
                  >
                    Login / Signup
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
      whileHover={{ y: -2 }}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
    </motion.a>
  );
}
