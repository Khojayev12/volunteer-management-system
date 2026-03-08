import { Link } from 'react-router-dom';
import './SignUpPage.css';

function SignUpPage() {
  return (
    <main className="signup-page">
      <section className="signup-left-panel">
        <div className="signup-brand">VolunteerLink</div>
        <blockquote className="signup-quote">
          “Volunteering is at the very core of being a human. No one has made it through
          life without someone else&apos;s help.”
        </blockquote>
        <p className="signup-quote-author">- Heather French Henry</p>
      </section>

      <section className="signup-right-panel">
        <form className="signup-form-card">
          <h1>Create an account</h1>
          <p>
            By creating an account you agree to our terms of service and privacy policy
          </p>

          <div className="signup-two-col">
            <label>
              First Name
              <input type="text" defaultValue="harry" />
            </label>
            <label>
              Last Name
              <input type="text" defaultValue="potter" />
            </label>
          </div>

          <label>
            Email
            <input type="email" defaultValue="harry@potter.com" />
          </label>

          <label>
            Username
            <input type="text" defaultValue="harry_potter" />
          </label>

          <label>
            Location
            <select defaultValue="Addis Ababa">
              <option>Addis Ababa</option>
              <option>Hawassa</option>
              <option>Adama</option>
              <option>Bahir Dar</option>
            </select>
          </label>

          <label>
            Password
            <input type="password" defaultValue="**************" />
          </label>

          <label>
            Repeat password
            <input type="password" defaultValue="**************" />
          </label>

          <button type="submit" className="btn btn-primary signup-submit-btn">
            Sign up
          </button>

          <p className="signup-login-line">
            Already have an account? <Link to="/login">Login.</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default SignUpPage;
