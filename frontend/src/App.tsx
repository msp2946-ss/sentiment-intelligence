import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { DocumentationPage } from './pages/DocumentationPage';
import { ApiReferencePage } from './pages/ApiReferencePage';
import { GuidesPage } from './pages/GuidesPage';
import { SupportPage } from './pages/SupportPage';
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { RequireAuth } from './components/RequireAuth';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { CookieConsentPopup } from './components/CookieConsentPopup';

export default function App() {
  useEffect(() => {
    // Set default theme to light mode on initial load
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    }

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/documentation" element={<RequireAuth><DocumentationPage /></RequireAuth>} />
          <Route path="/api-reference" element={<RequireAuth><ApiReferencePage /></RequireAuth>} />
          <Route path="/api-refrence" element={<RequireAuth><ApiReferencePage /></RequireAuth>} />
          <Route path="/apireference" element={<RequireAuth><ApiReferencePage /></RequireAuth>} />
          <Route path="/guides" element={<RequireAuth><GuidesPage /></RequireAuth>} />
          <Route path="/support" element={<RequireAuth><SupportPage /></RequireAuth>} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsentPopup />
    </div>
  );
}