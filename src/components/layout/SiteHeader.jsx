import { Link } from 'react-router-dom';
import './SiteHeader.css';

function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="site-brand" aria-label="Volunteer Management System home">
        VMS
      </Link>
      <nav className="site-nav-links" aria-label="Main navigation">
        <a href="/#about">About us</a>
        <a href="/#organizations">Organizations</a>
        <Link to="/contactus">Contact</Link>
        <button type="button" className="btn btn-primary btn-small">
          Sign in
        </button>
      </nav>
    </header>
  );
}

export default SiteHeader;
