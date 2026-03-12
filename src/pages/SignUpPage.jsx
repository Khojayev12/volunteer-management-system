import { Link } from 'react-router-dom';
import './SignUpPage.css';

function SignUpPage() {
  return (
    <main className="signup-page auth-page">
      <section className="signup-left-panel auth-left-panel">
        <div className="signup-brand auth-brand">VolunteerLink</div>
        <blockquote className="signup-quote auth-quote">
          “Volunteering is at the very core of being a human. No one has made it through
          life without someone else&apos;s help.”
        </blockquote>
        <p className="signup-quote-author auth-quote-author">- Heather French Henry</p>
      </section>

      <section className="signup-right-panel auth-right-panel">
        <form className="signup-form-card auth-form-card">
          <h1>Create an account</h1>
          <p>
            By creating an account you agree to our terms of service and privacy policy
          </p>

          <div className="signup-two-col">
            <label>
              First Name
              <input className="form-control" type="text" defaultValue="harry" />
            </label>
            <label>
              Last Name
              <input className="form-control" type="text" defaultValue="potter" />
            </label>
          </div>

          <label>
            Email
            <input className="form-control" type="email" defaultValue="harry@potter.com" />
          </label>

          <label>
            Username
            <input className="form-control" type="text" defaultValue="harry_potter" />
          </label>

          <label>
            Password
            <input className="form-control" type="password" defaultValue="**************" />
          </label>

          <label>
            Repeat password
            <input className="form-control" type="password" defaultValue="**************" />
          </label>

          <button type="submit" className="btn btn-primary signup-submit-btn auth-submit-btn">
            Sign up
          </button>

          <p className="signup-login-line auth-alt-line">
            Already have an account? <Link to="/login">Login.</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default SignUpPage;
