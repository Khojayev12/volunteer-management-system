import { Link, useParams } from 'react-router-dom';
import HomeTopBar from '../components/home/HomeTopBar';
import { getUserById } from '../constants/userPageData';
import './UserDetailsPage.css';

function UserDetailsPage() {
  const { userId } = useParams();
  const user = getUserById(userId);

  if (!user) {
    return (
      <main className="user-details-page">
        <HomeTopBar />
        <section className="user-missing">
          <h1>User not found</h1>
          <Link to="/home" className="btn btn-primary">
            Back to home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="user-details-page">
      <HomeTopBar />

      <div className="user-profile-layout">
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

              <button type="button" className="profile-edit-button" aria-label="Edit profile">
                edit
              </button>
            </div>

            <div className="social-links-block">
              <h2>Social Links</h2>
              <ul>
                {user.socialLinks.map((linkItem) => (
                  <li key={linkItem.id}>
                    <span className="social-icon" aria-hidden="true">
                      icon
                    </span>
                    <a href={linkItem.value}>{linkItem.value}</a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="user-side-menu">
            <article className="side-menu-item active">
              <p className="side-menu-title">Profile</p>
              <p className="side-menu-subtitle">Email, location, skills, contributions, badges, and details.</p>
            </article>
            <article className="side-menu-item">
              <p className="side-menu-title">Settings</p>
              <p className="side-menu-subtitle">Location preference, time preference, and account settings.</p>
            </article>
          </section>
        </aside>

        <section className="user-right-column">
          <article className="info-card">
            <h2>Personal Info</h2>
            <div className="personal-info-grid">
              <div>
                <p className="label">Name</p>
                <p className="value">{user.fullName}</p>
              </div>
              <div>
                <p className="label">Age</p>
                <p className="value">{user.age}</p>
              </div>
              <div>
                <p className="label">Gender</p>
                <p className="value">{user.gender}</p>
              </div>
              <div>
                <p className="label">Email</p>
                <p className="value">{user.email}</p>
              </div>
              <div>
                <p className="label">Location</p>
                <p className="value">{user.location}</p>
              </div>
            </div>
          </article>

          <article className="info-card">
            <h2>Bio</h2>
            <p className="bio-text">{user.bio}</p>
          </article>

          <article className="info-card skills-card">
            <h2>Skills</h2>
            <div className="skills-list">
              {user.skills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="info-card contribution-card">
            <h2>Contribution History</h2>
            <div className="contribution-list">
              {user.contributions.map((contribution) => (
                <article key={contribution.id} className="contribution-item">
                  <div className="contribution-head">
                    <div className="contribution-image-placeholder" aria-hidden="true">
                      image
                    </div>
                    <div>
                      <h3>{contribution.title}</h3>
                      <p className="contribution-period">{contribution.period}</p>
                    </div>
                  </div>
                  <p className="contribution-description">{contribution.description}</p>
                </article>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default UserDetailsPage;
