import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, UserIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setErrors({});

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setSubmitting(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setErrors(result.errors || {});
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
              <div className="mx-auto mb-4 d-flex align-items-center justify-content-center secondary-gradient rounded-4 shadow-lg" style={{width: '4rem', height: '4rem'}}>
                <UserPlusIcon className="text-white" style={{width: '2rem', height: '2rem'}} />
              </div>
              <h2 className="h3 fw-bold text-dark mb-2">
                Create Account
              </h2>
              <p className="text-muted">
                Join us and start managing your system
              </p>
              <p className="mt-3 small text-muted">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="fw-semibold text-primary text-decoration-none"
                >
                  Sign in here
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
                  
                  {/* Name Field */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold text-dark">
                      Full Name
                    </label>
                    <div className="position-relative">
                      <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                        <UserIcon className="text-muted" style={{width: '1.25rem', height: '1.25rem'}} />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="form-control ps-5 py-3 rounded-3 border-1"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{backgroundColor: 'rgba(248, 249, 250, 0.8)'}}
                      />
                    </div>
                    {errors.name && (
                      <div className="text-danger small mt-1 d-flex align-items-center">
                        <div className="bg-danger rounded-circle me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                        <span>{errors.name[0]}</span>
                      </div>
                    )}
                  </div>

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
                    {errors.email && (
                      <div className="text-danger small mt-1 d-flex align-items-center">
                        <div className="bg-danger rounded-circle me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                        <span>{errors.email[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
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
                        autoComplete="new-password"
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
                    {errors.password && (
                      <div className="text-danger small mt-1 d-flex align-items-center">
                        <div className="bg-danger rounded-circle me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                        <span>{errors.password[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password_confirmation" className="form-label fw-semibold text-dark">
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                        <LockClosedIcon className="text-muted" style={{width: '1.25rem', height: '1.25rem'}} />
                      </div>
                      <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className="form-control ps-5 pe-5 py-3 rounded-3 border-1"
                        placeholder="Confirm your password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        style={{backgroundColor: 'rgba(248, 249, 250, 0.8)'}}
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y pe-3 border-0 bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
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
                      className="btn btn-secondary py-3 fw-semibold rounded-3"
                    >
                      {submitting ? (
                        <div className="spinner-border spinner-border-sm text-white" role="status">
                          <span className="visually-hidden">Creating account...</span>
                        </div>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;