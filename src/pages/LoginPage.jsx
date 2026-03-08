import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-left-panel">
        <div className="login-brand">VolunteerLink</div>
        <blockquote className="login-quote">
          “Volunteering is at the very core of being a human. No one has made it through
          life without someone else&apos;s help.”
        </blockquote>
        <p className="login-quote-author">- Heather French Henry</p>
      </section>

      <section className="login-right-panel">
        <form className="login-form-card">
          <h1>Welcome Back.</h1>
          <p>Enter your credentials to login.</p>

          <label>
            Email
            <input type="email" defaultValue="harry@potter.com" />
          </label>

          <label>
            Password
            <input type="password" defaultValue="**************" />
          </label>

          <div className="login-forgot-row">
            <a href="#forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn">
            Login
          </button>

          <p className="login-signup-line">
            Don&apos;t have an account? <Link to="/signup">Create one.</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
