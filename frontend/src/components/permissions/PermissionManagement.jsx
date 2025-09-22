import React, { useState, useEffect } from 'react';
import { permissionsAPI } from '../../services/api';
import PermissionModal from './PermissionModal';
import Navigation from '../layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  KeyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const PermissionManagement = () => {
  const { hasPermission } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await permissionsAPI.getAll();
      setPermissions(response.data.data);
    } catch (error) {
      setError('Failed to fetch permissions');
      console.error('Error fetching permissions:', error);
    }
  };

  const handleCreatePermission = () => {
    setSelectedPermission(null);
    setIsModalOpen(true);
  };

  const handleEditPermission = (permission) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

  const handleDeletePermission = (permissionId) => {
    setPermissionToDelete(permissionId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await permissionsAPI.delete(permissionToDelete);
      setPermissions(permissions.filter(p => p.id !== permissionToDelete));
      setIsDeleteModalOpen(false);
      setPermissionToDelete(null);
    } catch (error) {
      setError('Failed to delete permission');
      console.error('Error deleting permission:', error);
    }
  };

  const handlePermissionSaved = (savedPermission) => {
    if (selectedPermission) {
      // Update existing permission
      setPermissions(permissions.map(p => 
        p.id === savedPermission.id ? savedPermission : p
      ));
    } else {
      // Add new permission
      setPermissions([...permissions, savedPermission]);
    }
    setIsModalOpen(false);
    setSelectedPermission(null);
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!hasPermission('view permissions')) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <ShieldCheckIcon style={{width: '3rem', height: '3rem'}} className="text-muted mx-auto mb-3" />
          <h3 className="fw-medium text-dark mb-2">Access Denied</h3>
          <p className="text-muted small">
            You don't have permission to manage permissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient-primary">
      <Navigation onToggle={setSidebarCollapsed} />
      
      <div className={`container-fluid py-4 main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4">
              <div className="flex-grow-1">
                <h1 className="display-5 fw-bold text-gradient mb-2">Permissions</h1>
                <p className="text-muted small">
                  Manage system permissions and access controls.
                </p>
              </div>
              <div className="mt-3 mt-sm-0">
                <button
                  type="button"
                  onClick={handleCreatePermission}
                  className="btn btn-primary btn-lg d-inline-flex align-items-center shadow-lg"
                >
                  <PlusIcon style={{width: '1.25rem', height: '1.25rem'}} className="me-2" />
                  Add Permission
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger shadow-sm" style={{borderRadius: '0.75rem'}}>
                {error}
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <div className="position-relative">
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                  <MagnifyingGlassIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-muted" />
                </div>
                <input
                  type="text"
                  className="form-control form-control-lg ps-5 shadow-sm"
                  style={{borderRadius: '0.75rem'}}
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Permissions Table */}
            <div className="card shadow-lg border-0 bg-white bg-opacity-90" style={{borderRadius: '1rem'}}>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-uppercase fw-semibold text-muted small border-0">
                        Permission
                      </th>
                      <th className="px-4 py-3 text-uppercase fw-semibold text-muted small border-0">
                        Description
                      </th>
                      <th className="px-4 py-3 text-uppercase fw-semibold text-muted small border-0">
                        Created
                      </th>
                      <th className="px-4 py-3 border-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPermissions.map((permission) => (
                      <tr key={permission.id} className="border-0">
                        <td className="px-4 py-4 border-0">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-gradient-success d-flex align-items-center justify-content-center shadow-sm me-3" style={{width: '2.5rem', height: '2.5rem'}}>
                              <KeyIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-white" />
                            </div>
                            <div className="fw-semibold text-dark">{permission.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 border-0">
                          <div className="text-muted small" style={{maxWidth: '20rem'}}>
                            {permission.description || 'No description provided'}
                          </div>
                        </td>
                        <td className="px-4 py-4 border-0 text-muted small">
                          {new Date(permission.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 border-0">
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              onClick={() => handleEditPermission(permission)}
                              className="btn btn-sm btn-outline-primary border-0 hover-scale"
                              title="Edit permission"
                            >
                              <PencilIcon style={{width: '1rem', height: '1rem'}} />
                            </button>
                            <button
                              onClick={() => handleDeletePermission(permission.id)}
                              className="btn btn-sm btn-outline-danger border-0 hover-scale"
                              title="Delete permission"
                            >
                              <TrashIcon style={{width: '1rem', height: '1rem'}} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredPermissions.length === 0 && (
              <div className="text-center py-5 fade-in">
                <div className="mx-auto rounded-circle bg-light d-flex align-items-center justify-content-center mb-3" style={{width: '4rem', height: '4rem'}}>
                  <KeyIcon style={{width: '2rem', height: '2rem'}} className="text-muted" />
                </div>
                <h5 className="fw-medium text-dark mb-2">No permissions found</h5>
                <p className="text-muted small">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first permission.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PermissionModal
          permission={selectedPermission}
          onClose={() => setIsModalOpen(false)}
          onSave={handlePermissionSaved}
        />
      )}

      {isDeleteModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0" style={{borderRadius: '1rem'}}>
              <div className="modal-body text-center p-4">
                <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 mb-4" style={{width: '3rem', height: '3rem'}}>
                  <ExclamationTriangleIcon style={{width: '1.5rem', height: '1.5rem'}} className="text-danger" />
                </div>
                <h5 className="fw-semibold text-dark mb-2">Delete Permission</h5>
                <p className="text-muted small mb-4">
                  Are you sure you want to delete this permission? This action cannot be undone.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManagement;