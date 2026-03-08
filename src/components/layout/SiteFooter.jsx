import './SiteFooter.css';

const usefulLinks = [
  ['About Us', '#about'],
  ['Organizations', '#organizations'],
  ['FAQ', '#faq'],
  ['Volunteers', '#volunteers'],
  ['Support', '#support'],
];

const socials = ['YouTube', 'LinkedIn', 'Instagram', 'Telegram'];

function SiteFooter({ variant = 'brand', showContactColumn = true }) {
  const isLight = variant === 'light';
  const footerClassName = `site-footer ${isLight ? 'site-footer-light' : ''}`;

  return (
    <footer className={footerClassName}>
      <div className="site-footer-inner">
        <section className="footer-brand-col">
          <div className="footer-brand">
            <span className="footer-brand-mark">⌂</span>
            <h3>VolunteerLink</h3>
          </div>
          <p>
            Ut est velit velit. Magnam quisquam dolor labore. Ipsum eius aliquam
            dolor quibus quaerat. Eius aliquam modi est. Etincidunt tempora numquam
            quibus. Magnam sed quibus modi ut dolor.
          </p>
          <div className="footer-socials" aria-label="Social links">
            {socials.map((social) => (
              <a key={social} href="#social" aria-label={social} className="footer-social-icon">
                {social.slice(0, 1)}
              </a>
            ))}
          </div>
        </section>

        <section className="footer-links-col">
          <h4>Useful links</h4>
          <div className="footer-links-grid">
            {usefulLinks.map(([label, href]) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>
        </section>

        {showContactColumn ? (
          <section className="footer-contact-col">
            <h4>Contact Us</h4>
            <div className="footer-contact-list">
              <p>
                <span>⌖</span> Addis Ababa, Ethiopia
              </p>
              <p>
                <span>✉</span> support@volunteerlink.com
              </p>
              <p>
                <span>☏</span> +2519-12-12-12-12
              </p>
              <p className="footer-contact-extra">+2519-12-12-12-12</p>
            </div>
          </section>
        ) : null}
      </div>

      <div className="footer-bottom-bar">
        <p>@VolunteerLink. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
