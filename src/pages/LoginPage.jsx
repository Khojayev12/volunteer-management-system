import { Link } from 'react-router-dom';
import headerLogo from '../assets/images/header-logo.png';
import './LoginPage.css';

function LoginPage() {
  return (
    <main className="login-page auth-page">
      <section className="login-left-panel auth-left-panel">
        <div className="login-brand auth-brand">
          <img src={headerLogo} alt="VMS" className="auth-brand-image" />
        </div>
        <blockquote className="login-quote auth-quote">
          “Volunteering is at the very core of being a human. No one has made it through
          life without someone else&apos;s help.”
        </blockquote>
        <p className="login-quote-author auth-quote-author">- Heather French Henry</p>
      </section>

      <section className="login-right-panel auth-right-panel">
        <form className="login-form-card auth-form-card">
          <h1>Welcome Back.</h1>
          <p>Enter your credentials to login.</p>

          <label>
            Email
            <input className="form-control" type="email" defaultValue="harry@potter.com" />
          </label>

          <label>
            Password
            <input className="form-control" type="password" defaultValue="**************" />
          </label>

          <div className="login-forgot-row">
            <a href="#forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn auth-submit-btn">
            Login
          </button>

          <p className="login-signup-line auth-alt-line">
            Don&apos;t have an account? <Link to="/signup">Create one.</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
