import { Link } from 'react-router-dom';
import SiteHeader from '../components/layout/SiteHeader';
import './NotFoundPage.css';

function NotFoundPage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="not-found-page">
      <div className="not-found-wrap">
        <SiteHeader />

        <section className="not-found-content">
          <div
            className="not-found-illustration-placeholder"
            role="img"
            aria-label="404 illustration placeholder"
          >
            Place image: 404-illustration.png
          </div>
          <h1>404 - Page Not Found</h1>
          <p>Oops! The page you are looking for could not be found.</p>
          <div className="not-found-actions">
            <button type="button" className="retry-link" onClick={handleRetry}>
              Try again
            </button>
            <Link to="/" className="btn btn-primary btn-small">
              Go back home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default NotFoundPage;
