import React, { useState, useEffect } from 'react';
import { rolesAPI } from '../../services/api';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const RoleModal = ({ role, permissions, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permission_ids: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        permission_ids: role.permissions?.map(permission => permission.id) || [],
      });
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter(id => id !== permissionId)
        : [...prev.permission_ids, permissionId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setErrors({});

    try {
      const roleData = {
        name: formData.name,
        description: formData.description,
        permissions: formData.permission_ids,
      };

      let response;
      if (role) {
        // Update existing role
        response = await rolesAPI.update(role.id, roleData);
      } else {
        // Create new role
        response = await rolesAPI.create(roleData);
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

  const toggleAllPermissions = () => {
    const allPermissionIds = permissions.map(p => p.id);
    const allSelected = allPermissionIds.every(id => formData.permission_ids.includes(id));
    
    setFormData(prev => ({
      ...prev,
      permission_ids: allSelected ? [] : allPermissionIds
    }));
  };

  const allSelected = permissions.length > 0 && permissions.every(p => formData.permission_ids.includes(p.id));

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0" style={{borderRadius: '1rem'}}>
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{width: '3rem', height: '3rem'}}>
                <UserGroupIcon style={{width: '1.5rem', height: '1.5rem'}} className="text-primary" />
              </div>
              <h5 className="modal-title fw-semibold text-dark">
                {role ? 'Edit Role' : 'Create Role'}
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

            <form id="roleForm" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-medium text-dark">
                  Role Name
                </label>
                <div className="position-relative">
                  <ShieldCheckIcon 
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
                    placeholder="Enter role name"
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name[0]}</div>
                  )}
                </div>
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-medium text-dark">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  style={{borderRadius: '0.75rem'}}
                  placeholder="Enter role description"
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description[0]}</div>
                )}
              </div>

              {/* Permissions Field */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <label className="form-label fw-medium text-dark mb-0">
                    Permissions
                  </label>
                  <button
                     type="button"
                     onClick={toggleAllPermissions}
                     className="btn btn-link btn-sm text-primary text-decoration-none fw-medium p-0"
                   >
                     {allSelected ? 'Deselect All' : 'Select All'}
                   </button>
                </div>
                <div className="border rounded-3 p-3" style={{maxHeight: '12rem', overflowY: 'auto', backgroundColor: '#f8f9fa'}}>
                  {permissions.map((permission) => (
                    <div key={permission.id} className="form-check mb-2">
                       <input
                         type="checkbox"
                         id={`permission-${permission.id}`}
                         checked={formData.permission_ids.includes(permission.id)}
                         onChange={() => handlePermissionChange(permission.id)}
                         className="form-check-input"
                       />
                       <label htmlFor={`permission-${permission.id}`} className="form-check-label text-dark">
                         {permission.name}
                       </label>
                     </div>
                  ))}
                  {permissions.length === 0 && (
                    <p className="text-muted small">No permissions available</p>
                  )}
                </div>
                {errors.permission_ids && (
                  <div className="text-danger small mt-2">{errors.permission_ids[0]}</div>
                )}
              </div>
            </form>
          </div>

          {/* Form Actions */}
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline-secondary me-2"
              style={{borderRadius: '50px'}}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="roleForm"
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
                role ? 'Update Role' : 'Create Role'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;