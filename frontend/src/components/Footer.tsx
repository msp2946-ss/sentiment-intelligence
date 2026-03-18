import { motion } from 'motion/react';
import { Github, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const openCookiePopup = () => {
    window.dispatchEvent(new Event('open-cookie-consent'));
  };

  return (
    <footer className="relative mt-20 border-t border-border/50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/5 dark:to-blue-500/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" aria-label="Go to home" className="inline-block">
              <motion.div
                className="flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-60" />
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    SentiAI
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Emotion Intelligence Platform
                  </p>
                </div>
              </motion.div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Advanced AI-powered sentiment analysis for modern applications. 
              Understand emotions with cutting-edge technology.
            </p>
            <div className="flex items-center gap-3">
              <SocialLink href="https://github.com/msp2946-ss/sentiment-intelligence" icon={<Github className="w-5 h-5" />} />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><FooterLink href="#features">Features</FooterLink></li>
              <li><FooterLink href="#demo">Demo</FooterLink></li>
              <li><FooterLink href="#examples">Examples</FooterLink></li>
              <li><FooterLink href="#">Pricing</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><FooterLink href="/documentation">Documentation</FooterLink></li>
              <li><FooterLink href="/api-reference">API Reference</FooterLink></li>
              <li><FooterLink href="/guides">Guides</FooterLink></li>
              <li><FooterLink href="/support">Support</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              © {currentYear} SentiAI. Made with MSP Teams
            </p>
            <div className="flex items-center gap-6">
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
              <FooterActionButton onClick={openCookiePopup}>Cookies</FooterActionButton>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterActionButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      className="hover:text-foreground transition-colors inline-block"
      whileHover={{ x: 2 }}
      type="button"
    >
      {children}
    </motion.button>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isInternalRoute = href.startsWith('/');

  if (isInternalRoute) {
    return (
      <motion.span whileHover={{ x: 2 }} className="inline-block">
        <Link to={href} className="hover:text-foreground transition-colors inline-block">
          {children}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.a
      href={href}
      className="hover:text-foreground transition-colors inline-block"
      whileHover={{ x: 2 }}
    >
      {children}
    </motion.a>
  );
}
