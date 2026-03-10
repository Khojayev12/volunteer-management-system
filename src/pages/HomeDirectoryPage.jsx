import { useMemo, useState } from 'react';
import FilterGroup from '../components/home/FilterGroup';
import FilterTag from '../components/home/FilterTag';
import HomeTopBar from '../components/home/HomeTopBar';
import OpportunityCard from '../components/home/OpportunityCard';
import {
  homeOpportunities,
  locationOptions,
  timePreferenceOptions,
} from '../constants/homeDashboardData';
import './HomeDirectoryPage.css';

function HomeDirectoryPage() {
  const [cityFilters, setCityFilters] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTimePreferences, setSelectedTimePreferences] = useState([]);

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
              type="search"
              placeholder="Search by project title, location, skill"
              aria-label="Search projects"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          <div className="opportunities-list">
            {homeOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} {...opportunity} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomeDirectoryPage;
