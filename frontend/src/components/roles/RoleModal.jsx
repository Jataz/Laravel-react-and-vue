import React, { useState, useEffect } from 'react';
import { rolesAPI } from '../../services/api';
import { XMarkIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const RoleModal = ({ role, permissions, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permission_ids: [],
  });
  const [loading, setLoading] = useState(false);
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
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'permission_ids') {
      const permissionId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        permission_ids: checked
          ? [...prev.permission_ids, permissionId]
          : prev.permission_ids.filter(id => id !== permissionId)
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

    try {
      let response;
      const roleData = {
        name: formData.name,
        description: formData.description,
        permissions: formData.permission_ids,
      };

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
      setLoading(false);
    }
  };

  const toggleAllPermissions = () => {
    if (formData.permission_ids.length === permissions.length) {
      // Deselect all
      setFormData(prev => ({ ...prev, permission_ids: [] }));
    } else {
      // Select all
      setFormData(prev => ({ 
        ...prev, 
        permission_ids: permissions.map(p => p.id) 
      }));
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content shadow-lg border-0" style={{borderRadius: '1rem'}}>
          <div className="modal-header bg-gradient-primary border-0 text-white" style={{borderRadius: '1rem 1rem 0 0'}}>
            <div className="d-flex align-items-center">
              <div className="rounded-3 bg-white bg-opacity-20 d-flex align-items-center justify-content-center me-3 p-2">
                <UserGroupIcon style={{width: '1.5rem', height: '1.5rem'}} className="text-white" />
              </div>
              <h5 className="modal-title fw-semibold mb-0">
                {role ? 'Edit Role' : 'Create New Role'}
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
                  Role Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="form-control shadow-sm"
                  style={{borderRadius: '0.75rem', backgroundColor: 'rgba(248, 249, 250, 0.8)'}}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Administrator, Editor, Viewer"
                />
                {errors.name && (
                  <div className="text-danger small mt-2 d-flex align-items-center">
                    <div className="rounded-circle bg-danger me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                    {errors.name[0]}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-semibold text-dark">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="form-control shadow-sm"
                  style={{borderRadius: '0.75rem', backgroundColor: 'rgba(248, 249, 250, 0.8)', resize: 'none'}}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the role's responsibilities and access level..."
                />
                {errors.description && (
                  <div className="text-danger small mt-2 d-flex align-items-center">
                    <div className="rounded-circle bg-danger me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                    {errors.description[0]}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="form-label fw-semibold text-dark mb-0 d-flex align-items-center">
                    <ShieldCheckIcon style={{width: '1rem', height: '1rem'}} className="text-primary me-2" />
                    <span>Permissions</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleAllPermissions}
                    className="btn btn-outline-primary btn-sm"
                    style={{borderRadius: '0.5rem'}}
                  >
                    {formData.permission_ids.length === permissions.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="border rounded-3 p-3 bg-light" style={{maxHeight: '16rem', overflowY: 'auto'}}>
                  <div className="row g-3">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="col-md-6">
                        <div className="form-check p-3 rounded-3 hover-bg-white h-100">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`permission-${permission.id}`}
                            name="permission_ids"
                            value={permission.id}
                            checked={formData.permission_ids.includes(permission.id)}
                            onChange={handleChange}
                          />
                          <label className="form-check-label fw-medium text-dark" htmlFor={`permission-${permission.id}`}>
                            {permission.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {permissions.length === 0 && (
                    <div className="text-center py-5">
                      <ShieldCheckIcon style={{width: '3rem', height: '3rem'}} className="text-muted mx-auto mb-3" />
                      <p className="text-muted fw-medium mb-0">No permissions available</p>
                    </div>
                  )}
                </div>
                {errors.permission_ids && (
                  <div className="text-danger small mt-2 d-flex align-items-center">
                    <div className="rounded-circle bg-danger me-2" style={{width: '0.25rem', height: '0.25rem'}}></div>
                    {errors.permission_ids[0]}
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
              style={{borderRadius: '0.75rem', minWidth: '100px'}}
              onClick={handleSubmit}
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <span>{role ? 'Update Role' : 'Create Role'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;