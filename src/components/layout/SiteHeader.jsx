import { Link } from 'react-router-dom';
import headerLogo from '../../assets/images/header-logo.png';
import './SiteHeader.css';

function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="site-brand" aria-label="Volunteer Management System home">
        <img src={headerLogo} alt="VMS" className="site-brand-logo" />
      </Link>
      <nav className="site-nav-links" aria-label="Main navigation">
        <a href="/#about">About us</a>
        <a href="/#organizations">Organizations</a>
        <Link to="/contactus">Contact</Link>
        <Link to="/login" className="btn btn-primary btn-small site-signin-link">
          Sign in
        </Link>
      </nav>
    </header>
  );
}

export default SiteHeader;
