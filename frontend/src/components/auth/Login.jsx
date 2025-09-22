import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
    
    setSubmitting(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center gradient-bg py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="mx-auto mb-4 d-flex align-items-center justify-content-center gradient-bg rounded-4 shadow-lg" style={{width: '4rem', height: '4rem'}}>
                <UserIcon className="text-white" style={{width: '2rem', height: '2rem'}} />
              </div>
              <h2 className="h3 fw-bold text-dark mb-2">
                Welcome Back
              </h2>
              <p className="text-muted">
                Sign in to access your dashboard
              </p>
              <p className="mt-3 small text-muted">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="fw-semibold text-primary text-decoration-none"
                >
                  Create one here
                </Link>
              </p>
            </div>

            {/* Form */}
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4" role="alert">
                      <div className="bg-danger rounded-circle me-2" style={{width: '0.5rem', height: '0.5rem'}}></div>
                      <span className="small fw-medium">{error}</span>
                    </div>
                  )}
                  
                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold text-dark">
                      Email Address
                    </label>
                    <div className="position-relative">
                      <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                        <EnvelopeIcon className="text-muted" style={{width: '1.25rem', height: '1.25rem'}} />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="form-control ps-5 py-3 rounded-3 border-1"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        style={{backgroundColor: 'rgba(248, 249, 250, 0.8)'}}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold text-dark">
                      Password
                    </label>
                    <div className="position-relative">
                      <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                        <LockClosedIcon className="text-muted" style={{width: '1.25rem', height: '1.25rem'}} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        className="form-control ps-5 pe-5 py-3 rounded-3 border-1"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{backgroundColor: 'rgba(248, 249, 250, 0.8)'}}
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y pe-3 border-0 bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="text-muted" style={{width: '1.25rem', height: '1.25rem'}} />
                        ) : (
                          <EyeIcon className="text-muted" style={{width: '1.25rem', height: '1.25rem'}} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary py-3 fw-semibold rounded-3"
                    >
                      {submitting ? (
                        <div className="spinner-border spinner-border-sm text-white" role="status">
                          <span className="visually-hidden">Signing in...</span>
                        </div>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Demo Credentials */}
                <div className="mt-4 pt-4 border-top">
                  <div className="alert alert-info rounded-3 mb-0">
                    <h6 className="alert-heading fw-semibold d-flex align-items-center mb-2">
                      <div className="bg-info rounded-circle me-2" style={{width: '0.5rem', height: '0.5rem'}}></div>
                      Demo Credentials
                    </h6>
                    <div className="small">
                      <p className="mb-1"><span className="fw-medium">Admin:</span> admin@example.com / password123</p>
                      <p className="mb-0"><span className="fw-medium">User:</span> user@example.com / password123</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;