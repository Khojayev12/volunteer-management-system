import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import headerLogo from '../assets/images/header-logo.png';
import { loginUser } from '../services/api/authApi';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const { email, password } = formData;

    if (!email.trim() || !password) {
      setSubmitError('Please enter your email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      if (response?.status === 'success') {
        navigate('/home', { replace: true });
      } else {
        setSubmitError('Unable to login. Please try again.');
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message;
      setSubmitError(apiMessage || 'Unable to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <form className="login-form-card auth-form-card" onSubmit={handleSubmit}>
          <h1>Welcome Back.</h1>
          <p>Enter your credentials to login.</p>

          <label>
            Email
            <input
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Password
            <input
              className="form-control"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>

          <div className="login-forgot-row">
            <a href="#forgot-password">Forgot password?</a>
          </div>

          {submitError ? (
            <p className="login-feedback login-feedback-error" role="alert">
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary login-submit-btn auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
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
