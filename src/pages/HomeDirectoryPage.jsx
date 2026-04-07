import { useEffect, useMemo, useState } from 'react';
import FilterGroup from '../components/home/FilterGroup';
import FilterTag from '../components/home/FilterTag';
import HomeTopBar from '../components/home/HomeTopBar';
import OpportunityCard from '../components/home/OpportunityCard';
import { getEvents } from '../services/api/eventsApi';
import { getOrganizationById } from '../services/api/organizationsApi';
import {
  locationOptions,
  timePreferenceOptions,
} from '../constants/homeDashboardData';
import './HomeDirectoryPage.css';

const formatEventDate = (value) => {
  if (!value) {
    return 'Unknown date';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const mapEventToOpportunity = (eventItem, organizationNameMap = {}) => {
  const title = String(eventItem?.title || '').trim() || 'Untitled event';
  const description =
    String(eventItem?.description || '').trim() || 'No description provided.';
  const location = String(eventItem?.location || '').trim() || 'Unknown location';
  const status = String(eventItem?.status || '').trim() || 'Unknown status';
  const organizationId = String(eventItem?.organization_id || '').trim();
  const organizationName = organizationNameMap[organizationId];
  const capacityValue = Number(eventItem?.capacity);
  const capacityLabel = Number.isFinite(capacityValue)
    ? `${capacityValue} volunteers`
    : 'Capacity N/A';

  return {
    id: String(eventItem?.id || ''),
    title,
    organization:
      organizationName || `Org ${organizationId.slice(0, 8) || 'N/A'}`,
    description,
    badges: [
      location,
      status,
      `Start: ${formatEventDate(eventItem?.start_date)}`,
      `End: ${formatEventDate(eventItem?.end_date)}`,
      capacityLabel,
    ],
  };
};

function HomeDirectoryPage() {
  const [cityFilters, setCityFilters] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTimePreferences, setSelectedTimePreferences] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');

  useEffect(() => {
    let isActive = true;

    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      setEventsError('');

      try {
        const response = await getEvents();
        const rawEvents = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        const uniqueOrganizationIds = [
          ...new Set(
            rawEvents
              .map((eventItem) => String(eventItem?.organization_id || '').trim())
              .filter(Boolean)
          ),
        ];
        const organizationNameMap = {};

        if (uniqueOrganizationIds.length) {
          const organizationResults = await Promise.allSettled(
            uniqueOrganizationIds.map((organizationId) =>
              getOrganizationById(organizationId)
            )
          );

          organizationResults.forEach((result, index) => {
            if (result.status !== 'fulfilled') {
              return;
            }

            const organizationId = uniqueOrganizationIds[index];
            const organizationName = String(result.value?.data?.name || '').trim();

            if (organizationId && organizationName) {
              organizationNameMap[organizationId] = organizationName;
            }
          });
        }

        const mappedEvents = rawEvents
          .map((eventItem) => mapEventToOpportunity(eventItem, organizationNameMap))
          .filter((eventItem) => eventItem.id);

        if (isActive) {
          setEvents(mappedEvents);
        }
      } catch (error) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message;

        if (isActive) {
          setEvents([]);
          setEventsError(apiMessage || 'Unable to load events.');
        }
      } finally {
        if (isActive) {
          setIsLoadingEvents(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isActive = false;
    };
  }, []);

  const selectedLocationTags = useMemo(
    () =>
      locationOptions
        .filter((option) => option.value === selectedLocation)
        .map((option) => ({ value: option.value, label: option.label })),
    [selectedLocation]
  );

  const selectedTimePreferenceTags = useMemo(
    () =>
      timePreferenceOptions
        .filter((option) => selectedTimePreferences.includes(option.value))
        .map((option) => ({ value: option.value, label: option.label })),
    [selectedTimePreferences]
  );

  const activeFilterTags = useMemo(
    () => [
      ...cityFilters.map((label) => ({ type: 'city', value: label, label })),
      ...selectedLocationTags.map((tag) => ({ type: 'location', ...tag })),
      ...selectedTimePreferenceTags.map((tag) => ({
        type: 'timePreference',
        ...tag,
      })),
    ],
    [cityFilters, selectedLocationTags, selectedTimePreferenceTags]
  );

  const handleClearAll = () => {
    setCityFilters([]);
    setSelectedLocation('');
    setSelectedTimePreferences([]);
  };

  const toggleCheckboxValue = (value, selectedValues, setSelectedValues) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
      return;
    }

    setSelectedValues([...selectedValues, value]);
  };

  const handleRemoveFilterTag = (tag) => {
    if (tag.type === 'city') {
      setCityFilters(cityFilters.filter((city) => city !== tag.value));
      return;
    }

    if (tag.type === 'location') {
      setSelectedLocation('');
      return;
    }

    if (tag.type === 'timePreference') {
      setSelectedTimePreferences(selectedTimePreferences.filter((time) => time !== tag.value));
    }
  };

  return (
    <main className="home-directory-page">
      <HomeTopBar />

      <div className="home-directory-content">
        <aside className="filters-panel" aria-label="Filters">
          <div className="filters-title-row">
            <h1>Filters</h1>
            <button type="button" className="clear-button" onClick={handleClearAll}>
              Clear all
            </button>
          </div>

          <div className="selected-filters">
            {activeFilterTags.map((filterTag) => (
              <FilterTag
                key={`${filterTag.type}-${filterTag.value}-${filterTag.label}`}
                label={filterTag.label}
                onRemove={() => handleRemoveFilterTag(filterTag)}
              />
            ))}
          </div>

          <FilterGroup title="Location">
            {locationOptions.map((option) => (
              <label key={option.value} className="control-row radio-row">
                <input
                  type="radio"
                  name="location"
                  value={option.value}
                  checked={selectedLocation === option.value}
                  onChange={() => setSelectedLocation(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Time Preference">
            {timePreferenceOptions.map((option) => (
              <label key={option.value} className="control-row checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedTimePreferences.includes(option.value)}
                  onChange={() =>
                    toggleCheckboxValue(
                      option.value,
                      selectedTimePreferences,
                      setSelectedTimePreferences
                    )
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </FilterGroup>
        </aside>

        <section className="opportunities-panel" aria-label="Projects">
          <form className="project-search-bar" onSubmit={(event) => event.preventDefault()}>
            <input
              className="form-control"
              type="search"
              placeholder="Search by project title, location, skill"
              aria-label="Search projects"
            />
            <button type="submit" className="btn btn-primary search-btn">
              Search
            </button>
          </form>

          <div className="opportunities-list">
            {isLoadingEvents ? <p className="home-events-feedback">Loading events...</p> : null}

            {!isLoadingEvents && eventsError ? (
              <p className="home-events-feedback home-events-feedback-error" role="alert">
                {eventsError}
              </p>
            ) : null}

            {!isLoadingEvents && !eventsError && !events.length ? (
              <p className="home-events-feedback">No events available right now.</p>
            ) : null}

            {!isLoadingEvents && !eventsError
              ? events.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} {...opportunity} />
                ))
              : null}
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomeDirectoryPage;
