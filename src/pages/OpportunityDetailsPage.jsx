import { Link, useParams } from 'react-router-dom';
import HomeTopBar from '../components/home/HomeTopBar';
import { getOpportunityById } from '../constants/homeDashboardData';
import './OpportunityDetailsPage.css';

function OpportunityDetailsPage() {
  const { opportunityId } = useParams();
  const opportunity = getOpportunityById(opportunityId);

  if (!opportunity) {
    return (
      <main className="opportunity-details-page">
        <HomeTopBar />
        <section className="opportunity-missing">
          <h1>Opportunity not found</h1>
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
          <button type="button" className="apply-button">
            Apply
          </button>
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
            <p className="block-label">Goals</p>
            <ul className="goals-list">
              {opportunity.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
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

          <div className="detail-block">
            <p className="block-label">Time Commitment</p>
            <div className="details-badge-row">
              {opportunity.timeCommitmentBadges.map((badge) => (
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
            <p className="block-label">Skills required</p>
            <div className="details-badge-row">
              <span className="details-pill">{opportunity.skillsRequiredCount}</span>
              <span className="details-pill">Volunteers needed</span>
            </div>
            <ul className="skills-list">
              {opportunity.skills.map((skill) => (
                <li key={skill.id}>
                  <span className="skill-id">{skill.id}</span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

export default OpportunityDetailsPage;
