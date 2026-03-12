import { Link } from 'react-router-dom';
import HomeTopBar from '../components/home/HomeTopBar';
import ProfileSidebar from '../components/user/ProfileSidebar';
import { getUserById } from '../constants/userPageData';
import './UserDetailsPage.css';
import './EditProfilePage.css';

function EditProfilePage() {
  const user = getUserById('john-doe');

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
        <ProfileSidebar user={user} activeSection="" editTarget="/editprofile" />

        <section className="edit-right-column">
          <p className="edit-heading-row">
            <Link to={`/user/${user.id}/`} className="edit-back-link">
              &larr;
            </Link>
            <span>Edit Profile</span>
          </p>

          <article className="edit-card profile-picture-card">
            <div className="edit-photo-placeholder" aria-hidden="true">
              photo
            </div>
            <div className="edit-photo-actions">
              <button type="button" className="photo-btn update">
                Update profile picture
              </button>
              <button type="button" className="photo-btn remove">
                Remove profile picture
              </button>
            </div>
          </article>

          <article className="edit-card">
            <div className="form-grid two-col">
              <label className="field">
                <span>First Name</span>
                <input defaultValue="John" />
              </label>
              <label className="field">
                <span>Last Name</span>
                <input defaultValue="Doe" />
              </label>
            </div>

            <label className="field">
              <span>Bio</span>
              <textarea
                rows="4"
                defaultValue="Quiquia est dolorem consectetur ipsum labore. Dolor quisquam consectetur dolor quiquia consectetur est consectetur. Est dolore porro labore tempora sit ut. Eius aliquam adipisci dolore. Velit labore quiquia magnam etincidunt quisquam. Etincidunt numquam velit est sit. Eius porro modi aliquam dolore dolor. Modi magnam sed consectetur dolorem sit sit."
              />
            </label>

            <div className="form-grid single-col">
              <label className="field short">
                <span>Username</span>
                <input defaultValue="john_doe" />
              </label>
            </div>

            <div className="form-grid split-small">
              <label className="field">
                <span>Gender</span>
                <select defaultValue="Male">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>
              <label className="field">
                <span>Age</span>
                <input defaultValue="23" />
              </label>
            </div>

            <div className="form-grid two-col">
              <label className="field">
                <span>Email</span>
                <input defaultValue="Johndoe@gamil.com" />
              </label>
              <label className="field">
                <span>Locations</span>
                <select defaultValue="Addis Ababa">
                  <option>Addis Ababa</option>
                  <option>Toshkent</option>
                  <option>Khiva</option>
                  <option>Samarqand</option>
                  <option>Buxoro</option>
                </select>
              </label>
            </div>
          </article>

          <article className="edit-card social-edit-card">
            <div className="social-edit-list">
              {user.socialLinks.map((linkItem) => (
                <div key={linkItem.id} className="social-edit-row">
                  <div className="social-edit-label">
                    <span className="social-edit-icon" aria-hidden="true">
                      icon
                    </span>
                    <span>{linkItem.label}</span>
                  </div>
                  <input value={linkItem.value} readOnly aria-label={`${linkItem.label} link`} />
                  <button type="button" className="remove-item-btn" aria-label={`Remove ${linkItem.label}`}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="add-link-btn">
              Add more social links
            </button>
          </article>

          <article className="edit-card skills-edit-card">
            <div className="skills-edit-list">
              {user.skills.map((skill) => (
                <div key={skill.id} className="skill-edit-row">
                  <div>
                    <h3>{skill.title}</h3>
                    <p>{skill.description}</p>
                  </div>
                  <button type="button" className="remove-item-btn" aria-label={`Remove ${skill.title}`}>
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="add-skill-wrap">
              <p>Add new skill</p>
              <input type="search" placeholder="Search for new skills..." aria-label="Search new skills" />
            </div>
          </article>

          <article className="edit-card education-card">
            <div className="education-list">
              <div className="education-item">
                <div className="education-head">
                  <div>
                    <h3>Software Engineering</h3>
                    <p className="education-meta">School name&nbsp;&nbsp; Jan 2024 - Jan 2025</p>
                  </div>
                  <div className="education-actions">
                    <button type="button" aria-label="Edit education">
                      edit
                    </button>
                    <button type="button" aria-label="Delete education">
                      del
                    </button>
                  </div>
                </div>
                <p className="education-description">
                  Sit velit quaerat modi non modi labore. Etincidunt tempora magnam etincidunt ut magnam neque.
                  Modi quaerat neque quisquam modi dolore quisquam. Aliquam porro dolore quiquia porro. Tempora
                  adipisci dolor adipisci amet ut.
                </p>
              </div>

              <div className="education-item">
                <div className="education-head">
                  <div>
                    <h3>Software Engineering</h3>
                    <p className="education-meta">School name&nbsp;&nbsp; Jan 2024 - Jan 2025</p>
                  </div>
                  <div className="education-actions">
                    <button type="button" aria-label="Edit education">
                      edit
                    </button>
                    <button type="button" aria-label="Delete education">
                      del
                    </button>
                  </div>
                </div>
                <p className="education-description">
                  Sit velit quaerat modi non modi labore. Etincidunt tempora magnam etincidunt ut magnam neque.
                  Modi quaerat neque quisquam modi dolore quisquam. Aliquam porro dolore quiquia porro. Tempora
                  adipisci dolor adipisci amet ut.
                </p>
              </div>
            </div>

            <div className="education-footer">
              <button type="button" className="btn btn-primary add-education-btn">
                Add new education history
              </button>
            </div>
          </article>

          <div className="edit-page-actions">
            <button type="button" className="btn btn-success save-btn">
              Save Changes
            </button>
            <button type="button" className="btn btn-outline cancel-btn">
              Cancel
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EditProfilePage;
