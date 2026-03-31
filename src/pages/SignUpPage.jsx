import { useState } from 'react';
import { Link } from 'react-router-dom';
import headerLogo from '../assets/images/header-logo.png';
import { registerUser } from '../services/api/authApi';
import './SignUpPage.css';

function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const { firstName, lastName, email, password, repeatPassword } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    if (password !== repeatPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await registerUser({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
      });

      if (response?.status === 'success') {
        setSubmitSuccess('Account created successfully. You can now log in.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          repeatPassword: '',
        });
      } else {
        setSubmitError('Unable to create account. Please try again.');
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message;
      setSubmitError(apiMessage || 'Unable to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signup-page auth-page">
      <section className="signup-left-panel auth-left-panel">
        <div className="signup-brand auth-brand">
          <img src={headerLogo} alt="VMS" className="auth-brand-image" />
        </div>
        <blockquote className="signup-quote auth-quote">
          “Volunteering is at the very core of being a human. No one has made it through
          life without someone else&apos;s help.”
        </blockquote>
        <p className="signup-quote-author auth-quote-author">- Heather French Henry</p>
      </section>

      <section className="signup-right-panel auth-right-panel">
        <form className="signup-form-card auth-form-card" onSubmit={handleSubmit}>
          <h1>Create an account</h1>
          <p>
            By creating an account you agree to our terms of service and privacy policy
          </p>

          <div className="signup-two-col">
            <label>
              First Name
              <input
                className="form-control"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Last Name
              <input
                className="form-control"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

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

          <label>
            Repeat password
            <input
              className="form-control"
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleInputChange}
              required
            />
          </label>

          {submitError ? (
            <p className="signup-feedback signup-feedback-error" role="alert">
              {submitError}
            </p>
          ) : null}

          {submitSuccess ? (
            <p className="signup-feedback signup-feedback-success" aria-live="polite">
              {submitSuccess}
            </p>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary signup-submit-btn auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing up...' : 'Sign up'}
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
