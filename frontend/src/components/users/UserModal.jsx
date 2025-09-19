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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

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
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'role_ids') {
      const roleId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        role_ids: checked
          ? [...prev.role_ids, roleId]
          : prev.role_ids.filter(id => id !== roleId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    setError('');
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrors({});

    // Validate passwords match for new users or when password is provided
    if (!user || formData.password) {
      if (formData.password !== formData.password_confirmation) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      let response;
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
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0" style={{borderRadius: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
          <div className="modal-header bg-gradient-primary border-0 text-white" style={{borderRadius: '1rem 1rem 0 0'}}>
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-white bg-opacity-20 d-flex align-items-center justify-content-center me-3" style={{width: '2.5rem', height: '2.5rem'}}>
                <UserIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-white" />
              </div>
              <h5 className="modal-title fw-semibold mb-0">
                {user ? 'Edit User' : 'Create User'}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4" style={{borderRadius: '0.75rem'}}>
                <div className="rounded-circle bg-danger me-2" style={{width: '0.5rem', height: '0.5rem'}}></div>
                <span className="fw-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-semibold text-dark">
                  Full Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0" style={{borderRadius: '0.75rem 0 0 0.75rem'}}>
                    <UserIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="form-control border-start-0 shadow-sm"
                    style={{borderRadius: '0 0.75rem 0.75rem 0', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {errors.name && (
                  <div className="text-danger small mt-2 d-flex align-items-center">
                    <div className="rounded-circle bg-danger me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                    {errors.name[0]}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-semibold text-dark">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0" style={{borderRadius: '0.75rem 0 0 0.75rem'}}>
                    <EnvelopeIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="form-control border-start-0 shadow-sm"
                    style={{borderRadius: '0 0.75rem 0.75rem 0', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <div className="text-danger small mt-2 d-flex align-items-center">
                    <div className="rounded-circle bg-danger me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                    {errors.email[0]}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold text-dark">
                  Password {user && <span className="text-muted fw-normal">(leave blank to keep current)</span>}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0" style={{borderRadius: '0.75rem 0 0 0.75rem'}}>
                    <LockClosedIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required={!user}
                    className="form-control border-start-0 shadow-sm"
                    style={{borderRadius: '0 0.75rem 0.75rem 0', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && (
                  <div className="text-danger small mt-2 d-flex align-items-center">
                    <div className="rounded-circle bg-danger me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                    {errors.password[0]}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password_confirmation" className="form-label fw-semibold text-dark">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0" style={{borderRadius: '0.75rem 0 0 0.75rem'}}>
                    <LockClosedIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    required={!user || formData.password}
                    className="form-control border-start-0 shadow-sm"
                    style={{borderRadius: '0 0.75rem 0.75rem 0', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
                    placeholder="Confirm password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark">
                  <div className="d-flex align-items-center">
                    <ShieldCheckIcon style={{width: '1rem', height: '1rem'}} className="text-muted me-2" />
                    <span>Assign Roles</span>
                  </div>
                </label>
                <div className="bg-light border rounded-3 p-3" style={{maxHeight: '10rem', overflowY: 'auto'}}>
                  {roles.map((role) => (
                    <div key={role.id} className="form-check p-2 rounded hover-bg-white">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`role-${role.id}`}
                        name="role_ids"
                        value={role.id}
                        checked={formData.role_ids.includes(role.id)}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-medium text-dark" htmlFor={`role-${role.id}`}>
                        {role.name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.role_ids && (
                  <div className="text-danger small mt-2 d-flex align-items-center">
                    <div className="rounded-circle bg-danger me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                    {errors.role_ids[0]}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="modal-footer border-top bg-light" style={{borderRadius: '0 0 1rem 1rem'}}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{borderRadius: '0.75rem'}}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary shadow-lg"
              style={{borderRadius: '0.75rem'}}
              onClick={handleSubmit}
            >
              {loading ? (
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Processing...</span>
                </div>
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