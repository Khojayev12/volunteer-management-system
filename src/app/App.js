import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ContactUsPage from '../pages/ContactUsPage';
import NotFoundPage from '../pages/NotFoundPage';
import SignUpPage from '../pages/SignUpPage';
import LoginPage from '../pages/LoginPage';
import SiteFooter from '../components/layout/SiteFooter';

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/signup', '/login'];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
