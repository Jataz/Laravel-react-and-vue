import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { XMarkIcon, UserIcon, EnvelopeIcon, LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const UserModal = ({ user, roles, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_ids: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMatch = formData.password === formData.password_confirmation;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role_ids: user.roles?.map(role => role.id) || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRoleChange = (roleId) => {
    setFormData(prev => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter(id => id !== roleId)
        : [...prev.role_ids, roleId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setErrors({});

    // Validate passwords match for new users or when password is provided
    if (!user || formData.password) {
      if (formData.password !== formData.password_confirmation) {
        setError('Passwords do not match');
        setSubmitting(false);
        return;
      }
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        role_ids: formData.role_ids,
      };

      // Only include password if it's provided
      if (formData.password) {
        userData.password = formData.password;
        userData.password_confirmation = formData.password_confirmation;
      }

      let response;
      if (user) {
        // Update existing user
        response = await usersAPI.update(user.id, userData);
      } else {
        // Create new user
        response = await usersAPI.create(userData);
      }

      onSave(response.data.data);
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      const validationErrors = error.response?.data?.errors || {};
      setError(message);
      setErrors(validationErrors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0" style={{borderRadius: '1rem'}}>
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{width: '3rem', height: '3rem'}}>
                <UserIcon style={{width: '1.5rem', height: '1.5rem'}} className="text-primary" />
              </div>
              <h5 className="modal-title fw-semibold text-dark">
                {user ? 'Edit User' : 'Create User'}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger border-0 shadow-sm mb-4" style={{borderRadius: '0.75rem'}}>
                <div className="d-flex align-items-center">
                  <XMarkIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-danger me-2" />
                  <span className="text-danger fw-medium">{error}</span>
                </div>
              </div>
            )}

            <form id="userForm" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-medium text-dark">
                  Full Name
                </label>
                <div className="position-relative">
                  <UserIcon 
                    style={{width: '1.25rem', height: '1.25rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10}} 
                    className="text-muted"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control form-control-lg ps-5 ${errors.name ? 'is-invalid' : ''}`}
                    style={{borderRadius: '0.75rem'}}
                    placeholder="Enter full name"
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name[0]}</div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-medium text-dark">
                  Email Address
                </label>
                <div className="position-relative">
                  <EnvelopeIcon 
                    style={{width: '1.25rem', height: '1.25rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10}} 
                    className="text-muted"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control form-control-lg ps-5 ${errors.email ? 'is-invalid' : ''}`}
                    style={{borderRadius: '0.75rem'}}
                    placeholder="Enter email address"
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email[0]}</div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-medium text-dark">
                  Password {user && <span className="text-muted small">(leave blank to keep current)</span>}
                </label>
                <div className="position-relative">
                  <LockClosedIcon 
                    style={{width: '1.25rem', height: '1.25rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10}} 
                    className="text-muted"
                  />
                  <input
                     type={showPassword ? 'text' : 'password'}
                     id="password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     className={`form-control form-control-lg ps-5 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                     style={{borderRadius: '0.75rem'}}
                     placeholder={user ? "Enter new password" : "Enter password"}
                     required={!user}
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="btn btn-link position-absolute"
                     style={{right: '0.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, border: 'none', background: 'none'}}
                   >
                     {showPassword ? (
                       <EyeSlashIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                     ) : (
                       <EyeIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                     )}
                   </button>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password[0]}</div>
                  )}
                </div>
              </div>

              {/* Confirm Password Field */}
              {(!user || formData.password) && (
                <div className="mb-4">
                  <label htmlFor="password_confirmation" className="form-label fw-medium text-dark">
                    Confirm Password
                  </label>
                  <div className="position-relative">
                    <LockClosedIcon 
                      style={{width: '1.25rem', height: '1.25rem', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10}} 
                      className="text-muted"
                    />
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className={`form-control form-control-lg ps-5 ${errors.password_confirmation ? 'is-invalid' : ''}`}
                      style={{borderRadius: '0.75rem'}}
                      placeholder="Confirm password"
                      required={!user || formData.password}
                    />
                    {errors.password_confirmation && (
                      <div className="invalid-feedback">{errors.password_confirmation[0]}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Roles Field */}
              <div className="mb-4">
                <label className="form-label fw-medium text-dark">
                  <ShieldCheckIcon style={{width: '1rem', height: '1rem'}} className="text-primary me-2" />
                  Roles
                </label>
                <div className="border rounded-3 p-3" style={{maxHeight: '8rem', overflowY: 'auto', backgroundColor: '#f8f9fa'}}>
                  {roles.map((role) => (
                    <div key={role.id} className="form-check mb-2">
                      <input
                         type="checkbox"
                         id={`role-${role.id}`}
                         checked={formData.role_ids.includes(role.id)}
                         onChange={() => handleRoleChange(role.id)}
                         className="form-check-input"
                       />
                      <label htmlFor={`role-${role.id}`} className="form-check-label text-dark">
                        {role.name}
                      </label>
                    </div>
                  ))}
                  {roles.length === 0 && (
                    <p className="text-muted small">No roles available</p>
                  )}
                </div>
                {errors.role_ids && (
                  <div className="text-danger small mt-1">{errors.role_ids[0]}</div>
                )}
              </div>
            </form>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-outline-secondary me-2"
              style={{borderRadius: '50px'}}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="userForm"
              disabled={submitting}
              className="btn btn-primary"
              style={{borderRadius: '50px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                user ? 'Update User' : 'Create User'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;