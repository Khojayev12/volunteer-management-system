import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeTopBar from '../components/home/HomeTopBar';
import ProfileSidebar from '../components/user/ProfileSidebar';
import { getUserById } from '../constants/userPageData';
import './UserDetailsPage.css';
import './EditProfilePage.css';

const SOCIAL_PLATFORMS = [
  'Telegram',
  'Instagram',
  'Facebook',
  'LinkedIn',
  'GitHub',
  'Dribbble',
];

const INITIAL_EDUCATION = [
  {
    id: 'education-1',
    title: 'Software Engineering',
    institution: 'School name',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    description:
      'Sit velit quaerat modi non modi labore. Etincidunt tempora magnam etincidunt ut magnam neque. Modi quaerat neque quisquam modi dolore quisquam. Aliquam porro dolore quiquia porro. Tempora adipisci dolor adipisci amet ut.',
  },
  {
    id: 'education-2',
    title: 'Software Engineering',
    institution: 'School name',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    description:
      'Sit velit quaerat modi non modi labore. Etincidunt tempora magnam etincidunt ut magnam neque. Modi quaerat neque quisquam modi dolore quisquam. Aliquam porro dolore quiquia porro. Tempora adipisci dolor adipisci amet ut.',
  },
];

const EMPTY_EDUCATION_FORM = {
  title: '',
  institution: '',
  startDate: '',
  endDate: '',
  description: '',
};

const createEmptyEducationForm = () => ({ ...EMPTY_EDUCATION_FORM });

const getInitialSocialLinks = (socialLinks) => {
  const initialValues = {};

  SOCIAL_PLATFORMS.forEach((platform) => {
    initialValues[platform] = '';
  });

  socialLinks.forEach((item) => {
    const matchedPlatform = SOCIAL_PLATFORMS.find(
      (platform) => platform.toLowerCase() === item.label.toLowerCase()
    );

    if (matchedPlatform) {
      initialValues[matchedPlatform] = item.value;
    }
  });

  return initialValues;
};

const getInitialSkills = (skills) =>
  skills.map((skill) => ({
    id: skill.id,
    title: skill.title,
    description: skill.description,
  }));

const formatEducationDate = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  const parsedDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

function SocialLinkInput({ platform, value, onChange, onClear }) {
  return (
    <div className="social-edit-row">
      <label className="social-edit-label" htmlFor={`social-${platform.toLowerCase()}`}>
        {platform}
      </label>
      <input
        id={`social-${platform.toLowerCase()}`}
        className="social-edit-input"
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`https://${platform.toLowerCase()}.com/username`}
        aria-label={`${platform} link`}
      />
      <button type="button" className="clear-social-btn" onClick={onClear} aria-label={`Clear ${platform}`}>
        &times;
      </button>
    </div>
  );
}

function SkillEditInputRow({ skill, onChange, onRemove }) {
  return (
    <div className="skill-edit-row">
      <div className="skill-edit-fields">
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={skill.title}
            onChange={(event) => onChange(skill.id, 'title', event.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            rows="3"
            value={skill.description}
            onChange={(event) => onChange(skill.id, 'description', event.target.value)}
            required
          />
        </label>
      </div>

      <button
        type="button"
        className="remove-item-btn skill-remove-btn"
        onClick={() => onRemove(skill.id)}
        aria-label={`Remove ${skill.title || 'skill'}`}
      >
        &times;
      </button>
    </div>
  );
}

function EducationModal({ mode, values, onChange, onSave, onClose }) {
  return (
    <div
      className="education-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="education-modal-title"
    >
      <div className="education-modal">
        <h3 id="education-modal-title" className="education-modal-title">
          {mode === 'edit' ? 'Edit education background' : 'Add new education background'}
        </h3>

        <form className="education-modal-form" onSubmit={onSave}>
          <label className="field">
            <span>Field</span>
            <input
              type="text"
              value={values.title}
              onChange={(event) => onChange('title', event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>School/Institute name</span>
            <input
              type="text"
              value={values.institution}
              onChange={(event) => onChange('institution', event.target.value)}
              required
            />
          </label>

          <div className="education-modal-grid">
            <label className="field">
              <span>Start Date</span>
              <input
                type="date"
                value={values.startDate}
                onChange={(event) => onChange('startDate', event.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>End Date</span>
              <input
                type="date"
                value={values.endDate}
                onChange={(event) => onChange('endDate', event.target.value)}
                required
              />
            </label>
          </div>

          <label className="field">
            <span>Description (Optional)</span>
            <textarea
              className="education-modal-textarea"
              value={values.description}
              onChange={(event) => onChange('description', event.target.value)}
              placeholder="Write some description here"
            />
          </label>

          <div className="education-modal-actions">
            <button type="submit" className="btn btn-primary education-modal-save">
              Save
            </button>
            <button type="button" className="btn btn-outline education-modal-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditProfilePage() {
  const user = getUserById('john-doe');
  const [socialLinks, setSocialLinks] = useState(() =>
    getInitialSocialLinks(user?.socialLinks || [])
  );
  const [skills, setSkills] = useState(() => getInitialSkills(user?.skills || []));
  const [educationList, setEducationList] = useState(INITIAL_EDUCATION);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [educationModalMode, setEducationModalMode] = useState('add');
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [educationForm, setEducationForm] = useState(createEmptyEducationForm);

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleClearSocialLink = (platform) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: '',
    }));
  };

  const handleSkillChange = (skillId, field, value) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === skillId ? { ...skill, [field]: value } : skill
      )
    );
  };

  const handleRemoveSkill = (skillId) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
  };

  const handleAddSkill = () => {
    const nextSkillId = `skill-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    setSkills((prev) => [
      ...prev,
      { id: nextSkillId, title: '', description: '' },
    ]);
  };

  const handleOpenAddEducationModal = () => {
    setEducationModalMode('add');
    setEditingEducationId(null);
    setEducationForm(createEmptyEducationForm());
    setIsEducationModalOpen(true);
  };

  const handleOpenEditEducationModal = (educationItem) => {
    setEducationModalMode('edit');
    setEditingEducationId(educationItem.id);
    setEducationForm({
      title: educationItem.title,
      institution: educationItem.institution,
      startDate: educationItem.startDate,
      endDate: educationItem.endDate,
      description: educationItem.description || '',
    });
    setIsEducationModalOpen(true);
  };

  const handleCloseEducationModal = () => {
    setIsEducationModalOpen(false);
    setEditingEducationId(null);
    setEducationForm(createEmptyEducationForm());
  };

  const handleEducationFormChange = (field, value) => {
    setEducationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEducation = (event) => {
    event.preventDefault();

    if (educationModalMode === 'edit' && editingEducationId) {
      setEducationList((prev) =>
        prev.map((item) =>
          item.id === editingEducationId ? { ...item, ...educationForm } : item
        )
      );
      handleCloseEducationModal();
      return;
    }

    const newEducationItem = {
      id: `education-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      ...educationForm,
    };

    setEducationList((prev) => [...prev, newEducationItem]);
    handleCloseEducationModal();
  };

  const handleDeleteEducation = (educationId) => {
    setEducationList((prev) => prev.filter((item) => item.id !== educationId));
  };

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

        <form className="edit-right-column" onSubmit={(event) => event.preventDefault()}>
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
            <h2 className="edit-section-title">Personal Information</h2>
            <div className="form-grid two-col">
              <label className="field">
                <span>First Name</span>
                <input defaultValue="John" required />
              </label>
              <label className="field">
                <span>Last Name</span>
                <input defaultValue="Doe" required />
              </label>
            </div>

            <label className="field">
              <span>Bio</span>
              <textarea
                rows="4"
                defaultValue="Quiquia est dolorem consectetur ipsum labore. Dolor quisquam consectetur dolor quiquia consectetur est consectetur. Est dolore porro labore tempora sit ut. Eius aliquam adipisci dolore. Velit labore quiquia magnam etincidunt quisquam. Etincidunt numquam velit est sit. Eius porro modi aliquam dolore dolor. Modi magnam sed consectetur dolorem sit sit."
                required
              />
            </label>

            <div className="form-grid two-col">
              <label className="field">
                <span>Gender</span>
                <select defaultValue="Male" required>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>
              <label className="field">
                <span>Birthdate</span>
                <input type="date" defaultValue="2001-01-15" required />
              </label>
            </div>

            <div className="form-grid two-col">
              <label className="field">
                <span>Email</span>
                <input type="email" defaultValue="Johndoe@gamil.com" required />
              </label>
              <label className="field">
                <span>Location</span>
                <input type="text" defaultValue="Addis Ababa" required />
              </label>
            </div>
          </article>

          <article className="edit-card social-edit-card">
            <h2 className="edit-section-title">Social Media</h2>
            <div className="social-edit-list">
              {SOCIAL_PLATFORMS.map((platform) => (
                <SocialLinkInput
                  key={platform}
                  platform={platform}
                  value={socialLinks[platform]}
                  onChange={(value) => handleSocialLinkChange(platform, value)}
                  onClear={() => handleClearSocialLink(platform)}
                />
              ))}
            </div>
          </article>

          <article className="edit-card skills-edit-card">
            <h2 className="edit-section-title">Skills</h2>
            <div className="skills-edit-list">
              {skills.map((skill) => (
                <SkillEditInputRow
                  key={skill.id}
                  skill={skill}
                  onChange={handleSkillChange}
                  onRemove={handleRemoveSkill}
                />
              ))}
            </div>

            <div className="add-skill-wrap">
              <button type="button" className="btn btn-outline add-skill-btn" onClick={handleAddSkill}>
                Add New Skill
              </button>
            </div>
          </article>

          <article className="edit-card education-card">
            <h2 className="edit-section-title">Education</h2>
            <div className="education-list">
              {educationList.map((education) => (
                <div key={education.id} className="education-item">
                  <div className="education-head">
                    <div>
                      <h3>{education.title}</h3>
                      <p className="education-meta">
                        {education.institution}&nbsp;&nbsp;
                        {formatEducationDate(education.startDate)} - {formatEducationDate(education.endDate)}
                      </p>
                    </div>
                    <div className="education-actions">
                      <button
                        type="button"
                        className="education-action-btn"
                        onClick={() => handleOpenEditEducationModal(education)}
                        aria-label={`Edit ${education.title || 'education'}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="education-action-btn education-action-delete"
                        onClick={() => handleDeleteEducation(education.id)}
                        aria-label={`Delete ${education.title || 'education'}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {education.description ? (
                    <p className="education-description">{education.description}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="education-footer">
              <button type="button" className="btn btn-primary add-education-btn" onClick={handleOpenAddEducationModal}>
                Add New Education History
              </button>
            </div>
          </article>

          <div className="edit-page-actions">
            <button type="submit" className="btn btn-success save-btn">
              Save Changes
            </button>
            <button type="button" className="btn btn-outline cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {isEducationModalOpen ? (
        <EducationModal
          mode={educationModalMode}
          values={educationForm}
          onChange={handleEducationFormChange}
          onSave={handleSaveEducation}
          onClose={handleCloseEducationModal}
        />
      ) : null}
    </main>
  );
}

export default EditProfilePage;
