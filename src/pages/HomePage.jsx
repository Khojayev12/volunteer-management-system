import ProjectsCarousel from '../components/common/ProjectsCarousel';
import SiteHeader from '../components/layout/SiteHeader';
import { projects, stats } from '../constants/homePageData';
import { Link } from 'react-router-dom';
import homeHeroIllustration from '../assets/images/home-hero-illustration.png';
import homeMissionIllustration from '../assets/images/home-mission-illustration.png';
import youtubePoster from '../assets/images/youtube-poster.jpg';
import './HomePage.css';

function HomePage() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <SiteHeader />

          <div className="hero-grid">
            <div className="hero-copy">
              <h1>Join Our Community of Volunteers</h1>
              <p>
                Join us in making a difference in our communities. Find opportunities to
                volunteer with non-profit organizations that match your interests.
                Volunteer Connect brings volunteers and non-profit organizations together.
                Start your journey with us today.
              </p>
              <div className="hero-actions">
                <Link to="/home" className="btn btn-outline">
                  Browse Projects
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            </div>

            <div className="hero-image-placeholder">
              <img
                src={homeHeroIllustration}
                alt="People volunteering together"
                className="hero-image"
              />
            </div>
          </div>
        </div>

        <div className="stats-row">
          {stats.map((item) => (
            <article key={item.label} className="stat-card">
              <h2>{item.value}</h2>
              <h3>{item.label}</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                luctus, dui non feugiat porta, nibh ipsum aliquet orci.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mission-section" id="about">
        <div className="mission-grid">
          <div className="mission-copy">
            <p className="section-kicker">Our Mission</p>
            <h2>Empowering Communities Through Volunteering</h2>
            <p>
              Our goal is to make it easy for individuals to find volunteering
              opportunities with non-profit organizations. Join us in making a
              difference. We connect people to impactful projects and help
              organizations build support from their communities.
            </p>
          </div>
          <div className="mission-image-placeholder">
            <img
              src={homeMissionIllustration}
              alt="Volunteers supporting community projects"
              className="mission-image"
            />
          </div>
        </div>
      </section>

      <section className="latest-projects-section" id="organizations">
        <div className="latest-projects-wrap">
          <h2>Latest Projects</h2>
          <ProjectsCarousel projects={projects} />
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefits-wrap">
          <div className="benefits-copy">
            <p className="section-kicker section-kicker-light">Benfits of Volunteering</p>
            <h2>Why Volunteer?</h2>
            <p>
              Volunteering provides valuable community services, so more money can be
              spent on local improvements. It is not just about the community, but also
              about the volunteer. Volunteering allows you to connect with your community
              and make it a better place.
            </p>
            <button type="button" className="btn btn-dark benefits-cta">
              Find out more
            </button>
          </div>

          <div
            className="benefits-video-placeholder"
            role="img"
            aria-label="Volunteer benefits video poster"
          >
            <img
              src={youtubePoster}
              alt="Volunteer benefits video poster"
              className="benefits-video-poster"
            />
            <span className="video-play-icon">&#9654;</span>
          </div>
        </div>
      </section>

      <section className="home-cta-section" id="contact">
        <div className="home-cta-wrap">
          <h2>Ready to make a difference?</h2>
          <p>Get involved today and help us build a better community.</p>
          <Link to="/signup" className="btn btn-primary btn-small">
            Join Us
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
