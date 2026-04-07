import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import HomeTopBar from '../components/home/HomeTopBar';
import { getEventById, registerForEvent } from '../services/api/eventsApi';
import { getOrganizationById } from '../services/api/organizationsApi';
import { getSessionUserId } from '../services/session/sessionManager';
import './OpportunityDetailsPage.css';

const getOptionalValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
};

const formatEventDate = (value) => {
  const normalized = getOptionalValue(value);
  if (!normalized) {
    return 'Unknown date';
  }

  const parsedDate = new Date(normalized);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const formatStatus = (value) => {
  const normalized = getOptionalValue(value);
  if (!normalized) {
    return 'Unknown';
  }

  return normalized
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((chunk) => `${chunk.charAt(0).toUpperCase()}${chunk.slice(1)}`)
    .join(' ');
};

const getEventRecordFromResponse = (response) => {
  if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    return response.data;
  }

  if (response && typeof response === 'object' && !Array.isArray(response)) {
    return response;
  }

  return null;
};

const getSkillsFromEvent = (eventItem) => {
  const rawSkills = Array.isArray(eventItem?.skills) ? eventItem.skills : [];

  return rawSkills
    .map((skillItem, index) => {
      const skillId = getOptionalValue(skillItem?.id) || `skill-${index}`;
      const skillName = getOptionalValue(skillItem?.name) || 'Untitled skill';
      const skillDescription =
        getOptionalValue(skillItem?.description) || 'No description provided.';

      return {
        id: skillId,
        name: skillName,
        description: skillDescription,
      };
    })
    .filter((skillItem) => skillItem.name || skillItem.description);
};

function OpportunityDetailsPage() {
  const { opportunityId } = useParams();
  const [eventRecord, setEventRecord] = useState(null);
  const [organizationName, setOrganizationName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  useEffect(() => {
    let isActive = true;

    const fetchEventDetails = async () => {
      setIsLoading(true);
      setLoadError('');
      setApplyError('');
      setApplySuccess('');

      try {
        const eventResponse = await getEventById(opportunityId);
        const eventData = getEventRecordFromResponse(eventResponse);

        if (!eventData?.id) {
          if (isActive) {
            setEventRecord(null);
            setOrganizationName('');
          }
          return;
        }

        const organizationId = getOptionalValue(eventData.organization_id);
        let resolvedOrganizationName = '';

        if (organizationId) {
          try {
            const organizationResponse = await getOrganizationById(organizationId);
            resolvedOrganizationName = getOptionalValue(
              organizationResponse?.data?.name || organizationResponse?.name
            );
          } catch {
            resolvedOrganizationName = '';
          }
        }

        if (isActive) {
          setEventRecord(eventData);
          setOrganizationName(resolvedOrganizationName);
        }
      } catch (error) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message;

        if (isActive) {
          setEventRecord(null);
          setOrganizationName('');
          setLoadError(apiMessage || 'Unable to load event details.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchEventDetails();

    return () => {
      isActive = false;
    };
  }, [opportunityId]);

  const handleApply = async () => {
    setApplyError('');
    setApplySuccess('');

    if (!eventRecord?.id) {
      setApplyError('Event details are not available. Please refresh and try again.');
      return;
    }

    const volunteerId = getOptionalValue(getSessionUserId());

    if (!volunteerId) {
      setApplyError('Please login first to apply for this event.');
      return;
    }

    try {
      setIsApplying(true);
      const response = await registerForEvent({
        event_id: eventRecord.id,
        volunteer_id: volunteerId,
      });

      if (response?.status && String(response.status).toLowerCase() !== 'success') {
        setApplyError('Unable to apply for this event. Please try again.');
        return;
      }

      setApplySuccess('You have successfully applied for this event.');
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message;
      setApplyError(apiMessage || 'Unable to apply for this event. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const opportunity = useMemo(() => {
    if (!eventRecord) {
      return null;
    }

    const organizationId = getOptionalValue(eventRecord.organization_id);
    const resolvedOrganization =
      organizationName ||
      (organizationId ? `Organization ${organizationId.slice(0, 8)}` : 'Unknown organization');
    const title = getOptionalValue(eventRecord.title) || 'Untitled event';
    const description =
      getOptionalValue(eventRecord.description) || 'No description provided.';
    const location = getOptionalValue(eventRecord.location) || 'Unknown location';
    const capacityValue = Number(eventRecord.capacity);
    const capacityText = Number.isFinite(capacityValue)
      ? String(capacityValue)
      : 'Not specified';

    return {
      title,
      organization: resolvedOrganization,
      status: formatStatus(eventRecord.status),
      description,
      locationBadges: [location],
      startDate: formatEventDate(eventRecord.start_date),
      endDate: formatEventDate(eventRecord.end_date),
      capacityCount: capacityText,
      skills: getSkillsFromEvent(eventRecord),
    };
  }, [eventRecord, organizationName]);

  if (isLoading) {
    return (
      <main className="opportunity-details-page">
        <HomeTopBar />
        <section className="opportunity-missing">
          <h1>Loading event details...</h1>
        </section>
      </main>
    );
  }

  if (!opportunity) {
    const fallbackTitle = loadError ? 'Unable to load event' : 'Opportunity not found';
    const fallbackDescription =
      loadError || 'The event does not exist or is no longer available.';

    return (
      <main className="opportunity-details-page">
        <HomeTopBar />
        <section className="opportunity-missing">
          <h1>{fallbackTitle}</h1>
          <p>{fallbackDescription}</p>
          <Link to="/home" className="btn btn-primary">
            Back to opportunities
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="opportunity-details-page">
      <HomeTopBar />

      <div className="opportunity-details-layout">
        <aside className="opportunity-summary-card">
          <h1>{opportunity.title}</h1>
          <p>{opportunity.organization}</p>
          <button
            type="button"
            className="btn btn-primary btn-full apply-button"
            onClick={handleApply}
            disabled={isApplying}
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
          {applyError ? (
            <p className="apply-feedback apply-feedback-error" role="alert">
              {applyError}
            </p>
          ) : null}
          {applySuccess ? (
            <p className="apply-feedback apply-feedback-success" aria-live="polite">
              {applySuccess}
            </p>
          ) : null}
        </aside>

        <section className="opportunity-main-card">
          <p className="details-heading-row">
            <Link to="/home" className="back-link">
              &larr;
            </Link>
            <span>Project Details</span>
          </p>

          <div className="detail-block">
            <p className="block-label">Project Title</p>
            <h2>{opportunity.title}</h2>
            <span className="status-pill">{opportunity.status}</span>
          </div>

          <div className="detail-block">
            <p className="block-label">Organized By</p>
            <p className="organized-by">
              <span className="details-logo-placeholder" aria-hidden="true">
                logo
              </span>
              <span>{opportunity.organization}</span>
            </p>
          </div>

          <div className="detail-block">
            <p className="block-label">Description</p>
            <p className="description-text">{opportunity.description}</p>
          </div>

          <div className="detail-block">
            <p className="block-label">Location</p>
            <div className="details-badge-row">
              {opportunity.locationBadges.map((badge) => (
                <span key={badge} className="details-pill">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="dates-row">
            <div>
              <p className="block-label">Start Date</p>
              <p className="date-value">{opportunity.startDate}</p>
            </div>
            <div>
              <p className="block-label">End Date</p>
              <p className="date-value">{opportunity.endDate}</p>
            </div>
          </div>

          <div className="detail-block">
            <p className="block-label">Capacity</p>
            <div className="details-badge-row">
              <span className="details-pill">{opportunity.capacityCount}</span>
              <span className="details-pill">Volunteers</span>
            </div>
          </div>

          <div className="detail-block">
            <p className="block-label">Required Skills</p>
            {opportunity.skills.length ? (
              <ul className="required-skills-list">
                {opportunity.skills.map((skill) => (
                  <li key={skill.id} className="required-skills-item">
                    <p className="required-skill-title">{skill.name}</p>
                    <p className="required-skill-description">{skill.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="description-text">No required skills were provided for this event.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default OpportunityDetailsPage;
