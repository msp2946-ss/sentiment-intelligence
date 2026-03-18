import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, CheckCircle2, Ban, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'sentiai_cookie_consent';
const COOKIE_POPUP_PENDING_KEY = 'sentiai_cookie_popup_pending';

type CookieChoice = 'allowed' | 'rejected' | null;

export function CookieConsentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [choice, setChoice] = useState<CookieChoice>(null);

  useEffect(() => {
    const existing = localStorage.getItem(COOKIE_CONSENT_KEY) as CookieChoice;
    if (existing === 'allowed' || existing === 'rejected') {
      setChoice(existing);
    } else {
      setIsOpen(true);
    }

    const pendingPopup = localStorage.getItem(COOKIE_POPUP_PENDING_KEY) === '1';
    if (pendingPopup) {
      setIsOpen(true);
      localStorage.removeItem(COOKIE_POPUP_PENDING_KEY);
    }
  }, []);

  useEffect(() => {
    const openPanel = () => setIsOpen(true);
    window.addEventListener('open-cookie-consent', openPanel);
    return () => window.removeEventListener('open-cookie-consent', openPanel);
  }, []);

  const onChoose = (value: Exclude<CookieChoice, null>) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setChoice(value);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-5 right-5 z-[70] w-[min(95vw,420px)]"
        >
          <div className="bg-background/95 dark:bg-background/70 backdrop-blur-2xl rounded-2xl border border-border/60 p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close cookie popup"
              className="absolute right-3 top-3 p-1.5 rounded-md hover:bg-secondary/60"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-xl bg-amber-500/15">
                <Cookie className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Cookie Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Choose how cookies are used for your session.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Essential cookies keep login and security working. You can update this anytime from the footer Cookies button.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => onChoose('allowed')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" />
                Allow
              </button>
              <button
                onClick={() => onChoose('rejected')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium"
              >
                <Ban className="w-4 h-4" />
                Reject
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Current choice: {choice ?? 'Not selected'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
