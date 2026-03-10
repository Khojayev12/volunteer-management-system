import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from '../pages/HomePage';
import ContactUsPage from '../pages/ContactUsPage';
import NotFoundPage from '../pages/NotFoundPage';
import SignUpPage from '../pages/SignUpPage';
import LoginPage from '../pages/LoginPage';
import SiteFooter from '../components/layout/SiteFooter';
import HomeDirectoryPage from '../pages/HomeDirectoryPage';
import OpportunityDetailsPage from '../pages/OpportunityDetailsPage';

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const shouldHideFooter =
    ['/signup', '/login', '/home'].includes(location.pathname) ||
    location.pathname.startsWith('/oppotunity/');
  const shouldShowFooter = !shouldHideFooter;

  return (
    <>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomeDirectoryPage />} />
        <Route path="/oppotunity/:opportunityId/" element={<OpportunityDetailsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {shouldShowFooter ? <SiteFooter /> : null}
    </>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
