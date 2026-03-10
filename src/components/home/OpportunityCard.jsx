import { Link } from 'react-router-dom';

function OpportunityCard({ id, title, organization, description, badges }) {
  return (
    <Link to={`/oppotunity/${id}/`} className="opportunity-card-link">
      <article className="opportunity-card">
        <div className="opportunity-header">
          <div className="logo-placeholder" aria-hidden="true">
            logo
          </div>
          <div>
            <h2>{title}</h2>
            <p className="organization-name">{organization}</p>
          </div>
        </div>

        <p className="opportunity-description">{description}</p>

        <div className="badge-row" aria-label="Opportunity details">
          {badges.map((badge) => (
            <span key={`${title}-${badge}`} className="badge-pill">
              {badge}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}

export default OpportunityCard;
