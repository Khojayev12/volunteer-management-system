import './HomeTopBar.css';

function HomeTopBar() {
  return (
    <header className="home-top-bar">
      <div className="home-top-brand">
        <span className="brand-mark" aria-hidden="true">
          logo
        </span>
        VolunteerLink
      </div>

      <div className="home-top-actions">
        <label className="home-top-search" htmlFor="global-search">
          <input
            id="global-search"
            className="form-control home-top-search-input"
            type="search"
            placeholder="Search"
          />
        </label>
        <button type="button" className="icon-button" aria-label="Notifications">
          notif
        </button>
        <div className="avatar-placeholder" aria-label="Profile image placeholder">
          img
        </div>
      </div>
    </header>
  );
}

export default HomeTopBar;
