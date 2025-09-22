import React, { useState, useEffect } from 'react';
import { rolesAPI } from '../../services/api';
import { XMarkIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="rounded-lg bg-blue-100 p-2 mr-3">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {role ? 'Edit Role' : 'Create Role'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Role Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter role name"
                required
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter role description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
            )}
          </div>

          {/* Permissions Field */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Permissions
              </label>
              <button
                type="button"
                onClick={toggleAllPermissions}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {formData.permission_ids.length === permissions.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    name="permission_ids"
                    value={permission.id}
                    checked={formData.permission_ids.includes(permission.id)}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{permission.name}</span>
                </label>
              ))}
              {permissions.length === 0 && (
                <p className="text-sm text-gray-500">No permissions available</p>
              )}
            </div>
            {errors.permission_ids && (
              <p className="mt-1 text-sm text-red-600">{errors.permission_ids[0]}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {role ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                role ? 'Update Role' : 'Create Role'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;