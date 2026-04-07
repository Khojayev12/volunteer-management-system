import { Link } from 'react-router-dom';
import './ProfileSidebar.css';

function ProfileSidebar({ user, activeSection = 'profile', editTarget = '/editprofile' }) {
  const availableSocialLinks = (user.socialLinks || []).filter((linkItem) =>
    String(linkItem?.href || linkItem?.value || '').trim()
  );

  return (
    <aside className="user-left-column">
      <section className="profile-card">
        <div className="profile-header-block">
          <div className="profile-photo-placeholder" aria-hidden="true">
            photo
          </div>

          <div className="profile-head-text">
            <h1>{user.displayName}</h1>
            <p>{user.username}</p>
            <span>Joined {user.joinedAt}</span>
          </div>

          <Link to={editTarget} className="profile-edit-button" aria-label="Edit profile">
            edit
          </Link>
        </div>

        <div className="social-links-block">
          <h2>Social Links</h2>
          {availableSocialLinks.length ? (
            <ul>
              {availableSocialLinks.map((linkItem) => (
                <li key={linkItem.id}>
                  <span className="social-icon" aria-hidden="true">
                    icon
                  </span>
                  <a href={linkItem.href || linkItem.value} target="_blank" rel="noreferrer">
                    {linkItem.value}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="social-links-empty">No social links added yet.</p>
          )}
        </div>
      </section>

      <section className="user-side-menu">
        <article className={`side-menu-item${activeSection === 'profile' ? ' active' : ''}`}>
          <p className="side-menu-title">Profile</p>
          <p className="side-menu-subtitle">Email, location, skills, contributions, badges, and details.</p>
        </article>
        <article className={`side-menu-item${activeSection === 'settings' ? ' active' : ''}`}>
          <p className="side-menu-title">Settings</p>
          <p className="side-menu-subtitle">Location preference, time preference, and account settings.</p>
        </article>
      </section>
    </aside>
  );
}

export default ProfileSidebar;
