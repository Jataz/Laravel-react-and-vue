import React, { useState, useEffect } from 'react';
import { permissionsAPI } from '../../services/api';
import { XMarkIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';

const PermissionModal = ({ permission, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || '',
        description: permission.description || '',
      });
    }
  }, [permission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setErrors({});

    try {
      let response;
      const permissionData = {
        name: formData.name,
        description: formData.description,
      };

      if (permission) {
        // Update existing permission
        response = await permissionsAPI.update(permission.id, permissionData);
      } else {
        // Create new permission
        response = await permissionsAPI.create(permissionData);
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
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0" style={{borderRadius: '1rem'}}>
          {/* Header */}
          <div className="modal-header bg-gradient-primary border-0 text-white" style={{borderRadius: '1rem 1rem 0 0'}}>
            <div className="d-flex align-items-center">
              <div className="rounded-3 bg-white bg-opacity-20 d-flex align-items-center justify-content-center me-3 p-2">
                <ShieldCheckIcon style={{width: '1.5rem', height: '1.5rem'}} className="text-white" />
              </div>
              <h5 className="modal-title fw-semibold">
                {permission ? 'Edit Permission' : 'Create New Permission'}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Content */}
          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4" style={{borderRadius: '0.75rem'}}>
                <div className="rounded-circle bg-danger me-2" style={{width: '0.5rem', height: '0.5rem'}}></div>
                <span className="fw-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-semibold text-dark d-flex align-items-center">
                  <KeyIcon style={{width: '1rem', height: '1rem'}} className="text-success me-2" />
                  Permission Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="form-control shadow-sm"
                  style={{borderRadius: '0.75rem'}}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., manage_users, view_reports, edit_content"
                />
                {errors.name && (
                  <div className="text-danger small mt-2 d-flex align-items-center">
                    <div className="rounded-circle bg-danger me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                    {errors.name[0]}
                  </div>
                )}
                <div className="form-text text-muted small">
                  Use lowercase letters, numbers, and underscores only.
                </div>
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-semibold text-dark">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="form-control shadow-sm"
                  style={{borderRadius: '0.75rem', resize: 'none'}}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this permission allows users to do..."
                />
                {errors.description && (
                  <div className="text-danger small mt-2 d-flex align-items-center">
                    <div className="rounded-circle bg-danger me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                    {errors.description[0]}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer border-top bg-light" style={{borderRadius: '0 0 1rem 1rem'}}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              onClick={handleSubmit}
              className="btn btn-primary shadow-lg"
            >
              {submitting ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Submitting...</span>
                  </div>
                  Submitting...
                </>
              ) : (
                <span>{permission ? 'Update Permission' : 'Create Permission'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;