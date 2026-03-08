import SiteHeader from '../components/layout/SiteHeader';
import './ContactUsPage.css';

function ContactUsPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-bg-cut" />
        <div className="contact-wrap">
          <SiteHeader />

          <div className="contact-intro">
            <h1>Contact Us</h1>
            <p>
              For inquiries, assistance, or feedback, connect with us through our
              contact page.
            </p>
          </div>

          <div className="contact-card">
            <form className="contact-form-panel">
              <h2>We are here for you! How can we help ?</h2>

              <div className="contact-form-grid">
                <label>
                  Name
                  <input type="text" defaultValue="harry potter" />
                </label>
                <label>
                  Email
                  <input type="email" defaultValue="harry@potter.com" />
                </label>
              </div>

              <label className="contact-message-label">
                Message
                <textarea defaultValue="Go ahead, we are listening" />
              </label>

              <button type="submit" className="btn btn-primary contact-submit-btn">
                Button
              </button>
            </form>

            <aside className="contact-info-panel">
              <h2>Contact Information</h2>
              <div className="contact-info-list">
                <p>
                  <span>⌖</span> Addis Ababa, Ethiopia
                </p>
                <p>
                  <span>✉</span> support@volunteerlink.com
                </p>
                <p>
                  <span>☏</span> +2519-12-12-12-12
                </p>
                <p className="contact-info-extra">+2519-12-12-12-12</p>
              </div>

              <div className="contact-socials">
                <a href="#youtube" aria-label="YouTube">
                  Y
                </a>
                <a href="#linkedin" aria-label="LinkedIn">
                  I
                </a>
                <a href="#instagram" aria-label="Instagram">
                  O
                </a>
                <a href="#telegram" aria-label="Telegram">
                  T
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactUsPage;
