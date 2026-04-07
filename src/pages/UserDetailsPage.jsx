import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import HomeTopBar from '../components/home/HomeTopBar';
import ProfileSidebar from '../components/user/ProfileSidebar';
import { getUserById } from '../constants/userPageData';
import { getUserProfile } from '../services/api/userApi';
import { getUserSkills } from '../services/api/skillsApi';
import { getUserSocialMediaLinks } from '../services/api/socialMediaLinksApi';
import './UserDetailsPage.css';

const SOCIAL_LINK_CONFIG = [
  {
    id: 'telegram',
    label: 'Telegram',
    keys: ['telegram', 'telegram_url', 'telegram_link', 'telegram_username'],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    keys: ['instagram', 'instagram_url', 'instagram_link', 'instagram_username'],
  },
  {
    id: 'facebook',
    label: 'Facebook',
    keys: ['facebook', 'facebook_url', 'facebook_link', 'facebook_username'],
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    keys: ['linkedin', 'linkedin_url', 'linkedin_link', 'linkedin_username'],
  },
  {
    id: 'github',
    label: 'GitHub',
    keys: ['github', 'github_url', 'github_link', 'github_username'],
  },
  {
    id: 'dribbble',
    label: 'Dribbble',
    keys: ['dribbble', 'dribbble_url', 'dribbble_link', 'dribbble_username'],
  },
];

const getDisplayValue = (value, fallback = 'Not specified') => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue || fallback;
};

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

const getSocialLabelFromIcon = (iconValue) => {
  const normalizedIcon = getOptionalValue(iconValue).toLowerCase();
  if (!normalizedIcon) {
    return 'Social';
  }

  const matchedPlatform = SOCIAL_LINK_CONFIG.find((platform) =>
    platform.keys.some((key) => key.toLowerCase() === normalizedIcon)
  );

  return matchedPlatform ? matchedPlatform.label : normalizedIcon;
};

const formatJoinedDate = (dateValue) => {
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

const calculateAge = (birthdayValue) => {
  if (!birthdayValue) {
    return 'Not specified';
  }

  const birthDate = new Date(birthdayValue);
  if (Number.isNaN(birthDate.getTime())) {
    return 'Not specified';
  }

  const now = new Date();
  let years = now.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDifference = now.getUTCMonth() - birthDate.getUTCMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && now.getUTCDate() < birthDate.getUTCDate())
  ) {
    years -= 1;
  }

  return years >= 0 ? String(years) : 'Not specified';
};

const extractSocialLinks = (apiUser) => {
  const nestedSocialLinks =
    apiUser?.social_links &&
    typeof apiUser.social_links === 'object' &&
    !Array.isArray(apiUser.social_links)
      ? apiUser.social_links
      : {};

  const configuredLinks = SOCIAL_LINK_CONFIG.map((platform) => {
    const platformValue = platform.keys
      .map((key) => getOptionalValue(apiUser?.[key] || nestedSocialLinks[key]))
      .find(Boolean);

    if (!platformValue) {
      return null;
    }

    return {
      id: platform.id,
      label: platform.label,
      value: platformValue,
      href: getUrlWithProtocol(platformValue),
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
          href: getUrlWithProtocol(value),
        };
      })
      .filter(Boolean);
  }

  return [];
};

const extractSkills = (apiUser) => {
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
      const skillId =
        getOptionalValue(item?.skill_id) ||
        getOptionalValue(item?.id) ||
        getOptionalValue(nestedSkill?.id);

      if (!title && !description) {
        return null;
      }

      return {
        id: skillId || `skill-${index}`,
        title: title || 'Untitled skill',
        description: description || 'No description provided.',
      };
    })
    .filter(Boolean);
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
      const skillId = getOptionalValue(item?.id) || getOptionalValue(item?.skill_id);

      if (!title && !description) {
        return null;
      }

      return {
        id: skillId || `skill-${index}`,
        title: title || 'Untitled skill',
        description: description || 'No description provided.',
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
        icon: iconValue,
        value,
        href: getUrlWithProtocol(value),
      };
    })
    .filter(Boolean);
};

const mapApiUserToProfileView = (apiUser) => {
  const firstName = getDisplayValue(apiUser?.first_name, '').trim();
  const lastName = getDisplayValue(apiUser?.last_name, '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const fallbackName = getDisplayValue(apiUser?.email, 'User');
  const normalizedFullName = fullName || fallbackName;
  const usernameValue = getDisplayValue(apiUser?.email, '').split('@')[0];

  return {
    id: getDisplayValue(apiUser?.id, ''),
    displayName: normalizedFullName,
    username: usernameValue ? `@${usernameValue}` : '@user',
    joinedAt: formatJoinedDate(apiUser?.created_at),
    fullName: normalizedFullName,
    age: calculateAge(apiUser?.birthday_at),
    gender: getDisplayValue(apiUser?.gender),
    email: getDisplayValue(apiUser?.email),
    location: getDisplayValue(apiUser?.location),
    bio: getDisplayValue(apiUser?.bio, 'No bio added yet.'),
    socialLinks: extractSocialLinks(apiUser),
    skills: extractSkills(apiUser),
    contributions: [],
  };
};

function UserDetailsPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isActive = true;

    const fetchUserProfile = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const [profileResponse, skillsResponse, socialLinksResponse] = await Promise.all([
          getUserProfile(userId),
          getUserSkills(userId).catch(() => null),
          getUserSocialMediaLinks(userId).catch(() => null),
        ]);
        const apiUser = profileResponse?.data;

        if (!apiUser) {
          throw new Error('Profile data is missing in response.');
        }

        const mappedUser = mapApiUserToProfileView(apiUser);
        const fetchedSkills = skillsResponse ? mapSkillsApiResponse(skillsResponse) : [];
        const fetchedSocialLinks = socialLinksResponse
          ? mapSocialMediaLinksApiResponse(socialLinksResponse)
          : [];

        if (isActive) {
          setUser({
            ...mappedUser,
            socialLinks: fetchedSocialLinks.length ? fetchedSocialLinks : mappedUser.socialLinks,
            skills: fetchedSkills.length ? fetchedSkills : mappedUser.skills,
          });
        }
      } catch (error) {
        const fallbackUser = getUserById(userId);

        if (!isActive) {
          return;
        }

        if (fallbackUser) {
          setUser(fallbackUser);
          return;
        }

        const apiMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message;

        setUser(null);
        setLoadError(apiMessage || 'Unable to load user profile.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    if (!userId) {
      setUser(null);
      setLoadError('User identifier is missing.');
      setIsLoading(false);
      return undefined;
    }

    fetchUserProfile();

    return () => {
      isActive = false;
    };
  }, [userId]);

  if (isLoading) {
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
        <ProfileSidebar user={user} activeSection="profile" editTarget={`/editprofile/${user.id}`} />

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
              {user.skills.length ? (
                user.skills.map((skill) => (
                  <div key={skill.id} className="user-skill-item">
                    <h3>{skill.title}</h3>
                    <p>{skill.description}</p>
                  </div>
                ))
              ) : (
                <p className="user-empty-note">No skills added yet.</p>
              )}
            </div>
          </article>

          <article className="info-card contribution-card">
            <h2>Contribution History</h2>
            <div className="contribution-list">
              {user.contributions.length ? (
                user.contributions.map((contribution) => (
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
                ))
              ) : (
                <p className="user-empty-note">No contributions available yet.</p>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default UserDetailsPage;
