import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import HomeTopBar from '../components/home/HomeTopBar';
import ProfileSidebar from '../components/user/ProfileSidebar';
import { getUserById } from '../constants/userPageData';
import { getUserProfile, updateUserProfile } from '../services/api/userApi';
import {
  assignSkillToUser,
  createSkill,
  getUserSkills,
  removeSkillFromUser,
} from '../services/api/skillsApi';
import {
  createSocialMediaLink,
  getUserSocialMediaLinks,
} from '../services/api/socialMediaLinksApi';
import { getSessionUserId } from '../services/session/sessionManager';
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

const EMPTY_PROFILE_FORM = {
  firstName: '',
  lastName: '',
  bio: '',
  gender: '',
  birthdate: '',
  email: '',
  location: '',
  status: 'active',
};

const createEmptyProfileForm = () => ({ ...EMPTY_PROFILE_FORM });

const getOptionalValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
};

const getUrlWithProtocol = (value) => {
  const normalizedValue = getOptionalValue(value);
  if (!normalizedValue) {
    return '';
  }

  if (/^https?:\/\//i.test(normalizedValue)) {
    return normalizedValue;
  }

  return `https://${normalizedValue}`;
};

const getNormalizedPlatformName = (platformName) =>
  getOptionalValue(platformName).toLowerCase();

const getSocialLabelFromIcon = (iconValue) => {
  const normalizedIcon = getNormalizedPlatformName(iconValue);
  if (!normalizedIcon) {
    return 'Social';
  }

  const matchedPlatform = SOCIAL_PLATFORMS.find(
    (platform) => getNormalizedPlatformName(platform) === normalizedIcon
  );

  return matchedPlatform || normalizedIcon;
};

const getFormattedJoinDate = (dateValue) => {
  if (!dateValue) {
    return 'Unknown date';
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

const getDateInputValue = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toISOString().slice(0, 10);
};

const getNameParts = (fullName) => {
  const normalized = getOptionalValue(fullName);
  if (!normalized) {
    return { firstName: '', lastName: '' };
  }

  const [firstName, ...rest] = normalized.split(/\s+/);
  return {
    firstName: firstName || '',
    lastName: rest.join(' '),
  };
};

const getSocialLinksFromApiUser = (apiUser) => {
  const configuredLinks = SOCIAL_PLATFORMS.map((platform) => {
    const key = platform.toLowerCase();
    const value =
      getOptionalValue(apiUser?.[`${key}_url`]) ||
      getOptionalValue(apiUser?.[`${key}_link`]) ||
      getOptionalValue(apiUser?.[key]) ||
      getOptionalValue(apiUser?.social_links?.[key]);

    if (!value) {
      return null;
    }

    return {
      id: key,
      label: platform,
      value,
    };
  }).filter(Boolean);

  if (configuredLinks.length) {
    return configuredLinks;
  }

  if (Array.isArray(apiUser?.social_links)) {
    return apiUser.social_links
      .map((item, index) => {
        const label = getOptionalValue(item?.label);
        const value = getOptionalValue(item?.value);

        if (!value) {
          return null;
        }

        return {
          id: getOptionalValue(item?.id) || `social-${index}`,
          label: label || 'Social',
          value,
        };
      })
      .filter(Boolean);
  }

  return [];
};

const mapApiUserToSidebarModel = (apiUser) => {
  const firstName = getOptionalValue(apiUser?.first_name);
  const lastName = getOptionalValue(apiUser?.last_name);
  const email = getOptionalValue(apiUser?.email);
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const displayName = fullName || email || 'User';
  const usernameSeed = email.split('@')[0];

  return {
    id: getOptionalValue(apiUser?.id),
    displayName,
    username: usernameSeed ? `@${usernameSeed}` : '@user',
    joinedAt: getFormattedJoinDate(apiUser?.created_at),
    fullName: displayName,
    age: '',
    gender: getOptionalValue(apiUser?.gender),
    email,
    location: getOptionalValue(apiUser?.location),
    bio: getOptionalValue(apiUser?.bio),
    socialLinks: getSocialLinksFromApiUser(apiUser),
    skills: getSkillsFromApiUser(apiUser),
    contributions: [],
  };
};

const mapApiUserToProfileForm = (apiUser) => ({
  firstName: getOptionalValue(apiUser?.first_name),
  lastName: getOptionalValue(apiUser?.last_name),
  bio: getOptionalValue(apiUser?.bio),
  gender: getOptionalValue(apiUser?.gender).toLowerCase(),
  birthdate: getDateInputValue(apiUser?.birthday_at),
  email: getOptionalValue(apiUser?.email),
  location: getOptionalValue(apiUser?.location),
  status: getOptionalValue(apiUser?.status).toLowerCase() || 'active',
});

const mapLocalUserToProfileForm = (localUser) => {
  const { firstName, lastName } = getNameParts(localUser?.fullName || localUser?.displayName);

  return {
    firstName,
    lastName,
    bio: getOptionalValue(localUser?.bio),
    gender: getOptionalValue(localUser?.gender).toLowerCase(),
    birthdate: '',
    email: getOptionalValue(localUser?.email),
    location: getOptionalValue(localUser?.location),
    status: 'active',
  };
};

const getSkillsFromApiUser = (apiUser) => {
  const rawSkills = Array.isArray(apiUser?.skills)
    ? apiUser.skills
    : Array.isArray(apiUser?.user_skills)
      ? apiUser.user_skills
      : [];

  return rawSkills
    .map((item, index) => {
      const nestedSkill =
        item?.skill && typeof item.skill === 'object' ? item.skill : null;
      const title =
        getOptionalValue(item?.title) ||
        getOptionalValue(item?.name) ||
        getOptionalValue(nestedSkill?.title) ||
        getOptionalValue(nestedSkill?.name);
      const description =
        getOptionalValue(item?.description) ||
        getOptionalValue(nestedSkill?.description);
      const backendSkillId =
        getOptionalValue(item?.skill_id) ||
        getOptionalValue(item?.id) ||
        getOptionalValue(nestedSkill?.id);

      if (!title && !description) {
        return null;
      }

      return {
        id: backendSkillId ? `skill-${backendSkillId}` : `skill-${index}`,
        backendSkillId: backendSkillId || null,
        title,
        description,
      };
    })
    .filter(Boolean);
};

const extractCreatedSkillId = (createSkillResponse) => {
  const candidateIds = [
    createSkillResponse?.data?.id,
    createSkillResponse?.data?.skill_id,
    createSkillResponse?.data?.skill?.id,
    createSkillResponse?.id,
    createSkillResponse?.skill_id,
    createSkillResponse?.skill?.id,
  ];

  const matchingValue = candidateIds.find(
    (value) => value !== undefined && value !== null && String(value).trim() !== ''
  );

  return matchingValue !== undefined && matchingValue !== null
    ? String(matchingValue)
    : '';
};

const mapSkillsApiResponse = (skillsResponse) => {
  const rawSkills = Array.isArray(skillsResponse)
    ? skillsResponse
    : Array.isArray(skillsResponse?.data)
      ? skillsResponse.data
      : [];

  return rawSkills
    .map((item, index) => {
      const title = getOptionalValue(item?.name) || getOptionalValue(item?.title);
      const description = getOptionalValue(item?.description);
      const backendSkillId = getOptionalValue(item?.id) || getOptionalValue(item?.skill_id);

      if (!title && !description) {
        return null;
      }

      return {
        id: backendSkillId ? `skill-${backendSkillId}` : `skill-${index}`,
        backendSkillId: backendSkillId || null,
        title: title || '',
        description: description || '',
      };
    })
    .filter(Boolean);
};

const mapSocialMediaLinksApiResponse = (linksResponse) => {
  const rawLinks = Array.isArray(linksResponse)
    ? linksResponse
    : Array.isArray(linksResponse?.data)
      ? linksResponse.data
      : [];

  return rawLinks
    .map((item, index) => {
      const value = getOptionalValue(item?.link);
      if (!value) {
        return null;
      }

      const iconValue = getOptionalValue(item?.icon);

      return {
        id: getOptionalValue(item?.id) || `social-${index}`,
        label: getSocialLabelFromIcon(iconValue),
        icon: iconValue || '',
        value,
        href: getUrlWithProtocol(value),
      };
    })
    .filter(Boolean);
};

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
    id:
      getOptionalValue(skill.id) ||
      `skill-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    backendSkillId: getOptionalValue(skill.backendSkillId) || null,
    title: getOptionalValue(skill.title),
    description: getOptionalValue(skill.description),
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

function SkillEditInputRow({ skill, onChange, onRemove, isRemoving = false }) {
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
        disabled={isRemoving}
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
  const { userId: routeUserId } = useParams();
  const [user, setUser] = useState(null);
  const [resolvedUserId, setResolvedUserId] = useState('');
  const [canUpdateProfile, setCanUpdateProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [removingSkillIds, setRemovingSkillIds] = useState([]);
  const [existingSocialMediaLinks, setExistingSocialMediaLinks] = useState([]);
  const [profileForm, setProfileForm] = useState(createEmptyProfileForm);
  const [socialLinks, setSocialLinks] = useState(() => getInitialSocialLinks([]));
  const [skills, setSkills] = useState(() => []);
  const [educationList, setEducationList] = useState(INITIAL_EDUCATION);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [educationModalMode, setEducationModalMode] = useState('add');
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [educationForm, setEducationForm] = useState(createEmptyEducationForm);

  useEffect(() => {
    let isActive = true;

    const hydrateFromLocalUser = (localUser, errorMessage = '') => {
      if (!isActive || !localUser) {
        return;
      }

      setUser(localUser);
      setResolvedUserId('');
      setCanUpdateProfile(false);
      setProfileForm(mapLocalUserToProfileForm(localUser));
      const localSocialLinks = (localUser.socialLinks || []).map((item, index) => ({
        id: getOptionalValue(item?.id) || `local-social-${index}`,
        label: getOptionalValue(item?.label) || 'Social',
        icon: getOptionalValue(item?.label),
        value: getOptionalValue(item?.value),
        href: getUrlWithProtocol(item?.value),
      }));
      setExistingSocialMediaLinks(localSocialLinks);
      setSocialLinks(getInitialSocialLinks(localSocialLinks));
      setSkills(getInitialSkills(localUser.skills || []));
      if (errorMessage) {
        setLoadError(errorMessage);
      }
    };

    const initializeProfile = async () => {
      setIsLoadingProfile(true);
      setLoadError('');
      setSaveError('');
      setSaveSuccess('');

      const storedUserId = getOptionalValue(getSessionUserId());
      const requestedUserId = getOptionalValue(routeUserId || storedUserId);

      if (!requestedUserId) {
        hydrateFromLocalUser(getUserById('john-doe'));
        if (isActive) {
          setIsLoadingProfile(false);
        }
        return;
      }

      try {
        const [profileResponse, skillsResponse, socialLinksResponse] = await Promise.all([
          getUserProfile(requestedUserId),
          getUserSkills(requestedUserId).catch(() => null),
          getUserSocialMediaLinks(requestedUserId).catch(() => null),
        ]);
        const apiUser = profileResponse?.data;

        if (!apiUser) {
          throw new Error('Profile data is missing in response.');
        }

        const mappedUser = mapApiUserToSidebarModel(apiUser);
        const fetchedSkills = skillsResponse ? mapSkillsApiResponse(skillsResponse) : [];
        const fetchedSocialLinks = socialLinksResponse
          ? mapSocialMediaLinksApiResponse(socialLinksResponse)
          : [];
        const editableSkills = fetchedSkills.length
          ? fetchedSkills
          : getSkillsFromApiUser(apiUser);
        const editableSocialLinks = fetchedSocialLinks.length
          ? fetchedSocialLinks
          : mappedUser.socialLinks;

        if (isActive) {
          setUser({
            ...mappedUser,
            socialLinks: editableSocialLinks,
            skills: editableSkills,
          });
          setResolvedUserId(mappedUser.id || requestedUserId);
          setCanUpdateProfile(true);
          setProfileForm(mapApiUserToProfileForm(apiUser));
          setExistingSocialMediaLinks(editableSocialLinks);
          setSocialLinks(getInitialSocialLinks(editableSocialLinks));
          setSkills(getInitialSkills(editableSkills));
        }
      } catch (error) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message;

        const fallbackUser = getUserById(requestedUserId) || getUserById('john-doe');

        if (fallbackUser) {
          hydrateFromLocalUser(
            fallbackUser,
            apiMessage || 'Unable to load profile from API. Showing local data.'
          );
        } else if (isActive) {
          setUser(null);
          setResolvedUserId('');
          setCanUpdateProfile(false);
          setLoadError(apiMessage || 'Unable to load user profile.');
        }
      } finally {
        if (isActive) {
          setIsLoadingProfile(false);
        }
      }
    };

    initializeProfile();

    return () => {
      isActive = false;
    };
  }, [routeUserId]);

  const handleProfileFieldChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleRemoveSkill = async (skillId) => {
    setSaveError('');
    setSaveSuccess('');

    const targetSkill = skills.find((skill) => skill.id === skillId);

    if (!targetSkill) {
      return;
    }

    if (!targetSkill.backendSkillId || !canUpdateProfile || !resolvedUserId) {
      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      return;
    }

    setRemovingSkillIds((prev) => [...prev, skillId]);

    try {
      await removeSkillFromUser(resolvedUserId, targetSkill.backendSkillId);
      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      setSaveSuccess('Skill removed successfully.');
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message;
      setSaveError(apiMessage || 'Unable to remove skill. Please try again.');
    } finally {
      setRemovingSkillIds((prev) => prev.filter((id) => id !== skillId));
    }
  };

  const handleAddSkill = () => {
    const nextSkillId = `skill-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    setSkills((prev) => [
      ...prev,
      { id: nextSkillId, backendSkillId: null, title: '', description: '' },
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

  const syncNewSkillsWithBackend = async (targetUserId) => {
    const nextSkills = [...skills];
    const syncErrors = [];

    for (let index = 0; index < nextSkills.length; index += 1) {
      const currentSkill = nextSkills[index];

      if (currentSkill?.backendSkillId) {
        continue;
      }

      const title = getOptionalValue(currentSkill?.title);
      const description = getOptionalValue(currentSkill?.description);

      if (!title || !description) {
        syncErrors.push(`${title || 'Untitled skill'} is missing title or description.`);
        continue;
      }

      try {
        const createResponse = await createSkill({
          name: title,
          description,
        });

        const createdSkillId = extractCreatedSkillId(createResponse);
        if (!createdSkillId) {
          throw new Error('Created skill id is missing in response.');
        }

        await assignSkillToUser(targetUserId, createdSkillId);

        nextSkills[index] = {
          ...currentSkill,
          backendSkillId: createdSkillId,
        };
      } catch (error) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message;
        syncErrors.push(`${title}: ${apiMessage || 'Unable to sync skill.'}`);
      }
    }

    return { nextSkills, syncErrors };
  };

  const syncSocialMediaLinksWithBackend = async (targetUserId) => {
    const nextExistingSocialLinks = [...existingSocialMediaLinks];
    const syncErrors = [];

    for (const platform of SOCIAL_PLATFORMS) {
      const inputValue = getOptionalValue(socialLinks[platform]);
      if (!inputValue) {
        continue;
      }

      const normalizedPlatform = getNormalizedPlatformName(platform);
      const alreadyExists = nextExistingSocialLinks.some((item) => {
        const existingLink = getOptionalValue(item?.value || item?.link);
        if (existingLink !== inputValue) {
          return false;
        }

        const existingPlatform = getNormalizedPlatformName(item?.icon || item?.label);
        return existingPlatform ? existingPlatform === normalizedPlatform : true;
      });

      if (alreadyExists) {
        continue;
      }

      try {
        const createResponse = await createSocialMediaLink({
          user_id: targetUserId,
          link: inputValue,
          icon: platform,
        });

        const createdLinks = mapSocialMediaLinksApiResponse([createResponse]);
        if (createdLinks.length) {
          nextExistingSocialLinks.push(createdLinks[0]);
        } else {
          nextExistingSocialLinks.push({
            id: `social-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            label: platform,
            icon: platform,
            value: inputValue,
            href: getUrlWithProtocol(inputValue),
          });
        }
      } catch (error) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message;
        syncErrors.push(`${platform}: ${apiMessage || 'Unable to sync social link.'}`);
      }
    }

    return { nextExistingSocialLinks, syncErrors };
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaveError('');
    setSaveSuccess('');

    const firstName = getOptionalValue(profileForm.firstName);
    const lastName = getOptionalValue(profileForm.lastName);
    const email = getOptionalValue(profileForm.email);

    if (!firstName || !lastName || !email) {
      setSaveError('First name, last name, and email are required.');
      return;
    }

    if (!canUpdateProfile || !resolvedUserId) {
      setSaveError('Profile update is not available for this user.');
      return;
    }

    const birthdateValue = getOptionalValue(profileForm.birthdate);
    const genderValue = getOptionalValue(profileForm.gender).toLowerCase();
    const locationValue = getOptionalValue(profileForm.location);
    const bioValue = getOptionalValue(profileForm.bio);
    const statusValue = getOptionalValue(profileForm.status).toLowerCase() || 'active';
    const birthdayAt = birthdateValue
      ? new Date(`${birthdateValue}T00:00:00.000Z`).toISOString()
      : null;

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      status: statusValue,
      birthday_at: birthdayAt,
      gender: genderValue || null,
      location: locationValue || null,
      bio: bioValue || null,
    };

    try {
      setIsSavingProfile(true);
      const response = await updateUserProfile(resolvedUserId, payload);

      if (response?.status !== 'success') {
        setSaveError('Unable to update profile. Please try again.');
        return;
      }

      const updatedApiUser = {
        ...(response?.data || {}),
        id: response?.data?.id || resolvedUserId,
        first_name: response?.data?.first_name || firstName,
        last_name: response?.data?.last_name || lastName,
        email: response?.data?.email || email,
        status: response?.data?.status || statusValue,
        birthday_at: response?.data?.birthday_at || birthdayAt,
        gender: response?.data?.gender ?? genderValue,
        location: response?.data?.location ?? locationValue,
        bio: response?.data?.bio ?? bioValue,
        created_at: response?.data?.created_at || null,
      };

      const nextProfileForm = mapApiUserToProfileForm(updatedApiUser);
      const fallbackDisplayName = [firstName, lastName].filter(Boolean).join(' ') || email;
      const mappedSidebarUser = mapApiUserToSidebarModel(updatedApiUser);
      const { nextSkills, syncErrors } = await syncNewSkillsWithBackend(
        updatedApiUser.id || resolvedUserId
      );
      const {
        nextExistingSocialLinks,
        syncErrors: socialSyncErrors,
      } = await syncSocialMediaLinksWithBackend(updatedApiUser.id || resolvedUserId);
      const hasUpdatedJoinedAt = Boolean(response?.data?.created_at);
      const nextSidebarModel = {
        ...(user || {}),
        ...mappedSidebarUser,
        id: updatedApiUser.id || resolvedUserId,
        displayName: mappedSidebarUser.displayName || fallbackDisplayName,
        fullName: mappedSidebarUser.fullName || fallbackDisplayName,
        username: mappedSidebarUser.username || `@${email.split('@')[0] || 'user'}`,
        joinedAt: hasUpdatedJoinedAt
          ? mappedSidebarUser.joinedAt
          : user?.joinedAt || mappedSidebarUser.joinedAt || 'Unknown date',
        socialLinks: nextExistingSocialLinks.length
          ? nextExistingSocialLinks
          : mappedSidebarUser.socialLinks.length
            ? mappedSidebarUser.socialLinks
            : user?.socialLinks || [],
        skills: nextSkills,
      };

      setProfileForm(nextProfileForm);
      setUser(nextSidebarModel);
      setExistingSocialMediaLinks(nextExistingSocialLinks);
      setSkills(nextSkills);
      setResolvedUserId(updatedApiUser.id || resolvedUserId);
      setCanUpdateProfile(true);

      const combinedSyncErrors = [...syncErrors, ...socialSyncErrors];
      if (combinedSyncErrors.length) {
        setSaveError(
          `Profile updated, but ${combinedSyncErrors.length} item(s) could not be synced. ${combinedSyncErrors[0]}`
        );
        return;
      }

      setSaveSuccess('Profile, skills, and social links updated successfully.');
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message;
      setSaveError(apiMessage || 'Unable to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <main className="user-details-page">
        <HomeTopBar />
        <section className="user-status-card">
          <h1>Loading profile...</h1>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="user-details-page">
        <HomeTopBar />
        <section className="user-missing">
          <h1>User not found</h1>
          {loadError ? <p className="user-missing-error">{loadError}</p> : null}
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
        <ProfileSidebar
          user={user}
          activeSection=""
          editTarget={resolvedUserId ? `/editprofile/${resolvedUserId}` : '/editprofile'}
        />

        <form className="edit-right-column" onSubmit={handleSaveProfile}>
          <p className="edit-heading-row">
            <Link to={user.id ? `/user/${user.id}/` : '/home'} className="edit-back-link">
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
                <input
                  value={profileForm.firstName}
                  onChange={(event) => handleProfileFieldChange('firstName', event.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span>Last Name</span>
                <input
                  value={profileForm.lastName}
                  onChange={(event) => handleProfileFieldChange('lastName', event.target.value)}
                  required
                />
              </label>
            </div>

            <label className="field">
              <span>Bio</span>
              <textarea
                rows="4"
                value={profileForm.bio}
                onChange={(event) => handleProfileFieldChange('bio', event.target.value)}
              />
            </label>

            <div className="form-grid two-col">
              <label className="field">
                <span>Gender</span>
                <select
                  value={profileForm.gender}
                  onChange={(event) => handleProfileFieldChange('gender', event.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label className="field">
                <span>Birthdate</span>
                <input
                  type="date"
                  value={profileForm.birthdate}
                  onChange={(event) => handleProfileFieldChange('birthdate', event.target.value)}
                />
              </label>
            </div>

            <div className="form-grid two-col">
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => handleProfileFieldChange('email', event.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(event) => handleProfileFieldChange('location', event.target.value)}
                />
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
                  isRemoving={removingSkillIds.includes(skill.id)}
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

          {loadError ? <p className="edit-feedback edit-feedback-warning">{loadError}</p> : null}
          {saveError ? <p className="edit-feedback edit-feedback-error">{saveError}</p> : null}
          {saveSuccess ? <p className="edit-feedback edit-feedback-success">{saveSuccess}</p> : null}

          <div className="edit-page-actions">
            <button
              type="submit"
              className="btn btn-success save-btn"
              disabled={isSavingProfile || !canUpdateProfile}
            >
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
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
