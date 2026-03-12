import { Link, useParams } from 'react-router-dom';
import HomeTopBar from '../components/home/HomeTopBar';
import ProfileSidebar from '../components/user/ProfileSidebar';
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
        <ProfileSidebar user={user} activeSection="profile" />

        <section className="user-right-column">
          <article className="info-card">
            <h2>Personal Info</h2>
            <div className="personal-info-grid">
              <div>
                <p className="user-detail-label">Name</p>
                <p className="user-detail-value">{user.fullName}</p>
              </div>
              <div>
                <p className="user-detail-label">Age</p>
                <p className="user-detail-value">{user.age}</p>
              </div>
              <div>
                <p className="user-detail-label">Gender</p>
                <p className="user-detail-value">{user.gender}</p>
              </div>
              <div>
                <p className="user-detail-label">Email</p>
                <p className="user-detail-value">{user.email}</p>
              </div>
              <div>
                <p className="user-detail-label">Location</p>
                <p className="user-detail-value">{user.location}</p>
              </div>
            </div>
          </article>

          <article className="info-card">
            <h2>Bio</h2>
            <p className="bio-text">{user.bio}</p>
          </article>

          <article className="info-card skills-card">
            <h2>Skills</h2>
            <div className="user-skills-list">
              {user.skills.map((skill) => (
                <div key={skill.id} className="user-skill-item">
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
