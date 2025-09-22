import React, { useState, useEffect } from 'react';
import { rolesAPI, permissionsAPI } from '../../services/api';
import Navigation from '../layout/Navigation';
import RoleModal from './RoleModal';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const RoleManagement = () => {
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesResponse, permissionsResponse] = await Promise.allSettled([
        rolesAPI.getAll(),
        permissionsAPI.getAll()
      ]);

      if (rolesResponse.status === 'fulfilled') {
        setRoles(rolesResponse.value.data.data || []);
      } else {
        console.error('Error fetching roles:', rolesResponse.reason);
        setError('Failed to fetch roles');
      }

      if (permissionsResponse.status === 'fulfilled') {
        setPermissions(permissionsResponse.value.data.data || []);
      } else {
        console.error('Error fetching permissions:', permissionsResponse.reason);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    }
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = (role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await rolesAPI.delete(roleToDelete.id);
      setRoles(roles.filter(role => role.id !== roleToDelete.id));
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      setError('Failed to delete role');
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleRoleSaved = (savedRole) => {
    if (selectedRole) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === savedRole.id ? savedRole : role
      ));
    } else {
      // Add new role
      setRoles([...roles, savedRole]);
    }
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!hasPermission('view roles')) {
    return (
      <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <Navigation sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
        <div className="container-fluid">
          <div className="row">
            <div className={`${sidebarCollapsed ? 'col-12' : 'col-md-9 col-lg-10'} ms-auto`}>
              <div className="d-flex align-items-center justify-content-center min-vh-100">
                <div className="text-center">
                  <ShieldCheckIcon style={{width: '4rem', height: '4rem'}} className="text-white mb-3" />
                  <h2 className="text-white mb-2">Access Denied</h2>
                  <p className="text-white-50">You don't have permission to view roles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <Navigation sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      
      <div className="container-fluid">
        <div className="row">
          <div className={`${sidebarCollapsed ? 'col-12' : 'col-md-9 col-lg-10'} ms-auto`}>
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 text-white mb-0 fw-bold">Role Management</h1>
                <button
                  onClick={handleCreateRole}
                  className="btn btn-light btn-lg shadow-lg border-0"
                  style={{borderRadius: '50px', background: 'linear-gradient(45deg, #ffffff, #f8f9fa)'}}
                >
                  <PlusIcon style={{width: '1.25rem', height: '1.25rem'}} className="me-2" />
                  Add Role
                </button>
              </div>

              {error && (
                <div className="alert alert-danger border-0 shadow-sm mb-4" style={{borderRadius: '1rem', background: 'rgba(220, 53, 69, 0.1)', backdropFilter: 'blur(10px)'}}>
                  <div className="d-flex align-items-center">
                    <ExclamationTriangleIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-danger me-2" />
                    <span className="text-danger fw-medium">{error}</span>
                    <button type="button" className="btn-close ms-auto" onClick={() => setError('')}></button>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="mb-4">
                <div className="position-relative">
                  <MagnifyingGlassIcon 
                    style={{width: '1.25rem', height: '1.25rem', position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10}} 
                    className="text-muted"
                  />
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control form-control-lg ps-5 shadow-sm"
                    style={{borderRadius: '50px'}}
                  />
                </div>
              </div>

              {/* Roles Table */}
              <div className="card shadow-lg border-0 bg-white bg-opacity-90" style={{borderRadius: '1rem', backdropFilter: 'blur(10px)'}}>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light bg-opacity-50">
                      <tr>
                        <th className="text-uppercase fw-semibold text-muted small border-0 py-3 ps-4">Role</th>
                        <th className="text-uppercase fw-semibold text-muted small border-0 py-3">Description</th>
                        <th className="text-uppercase fw-semibold text-muted small border-0 py-3">Permissions</th>
                        <th className="text-uppercase fw-semibold text-muted small border-0 py-3">Created</th>
                        <th className="text-uppercase fw-semibold text-muted small border-0 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRoles.map((role) => (
                        <tr key={role.id} className="border-0" style={{background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(248,249,250,0.8) 100%)'}}>
                          <td className="border-0 py-3 ps-4">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{width: '2.5rem', height: '2.5rem'}}>
                                <ShieldCheckIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-primary" />
                              </div>
                              <div>
                                <div className="fw-semibold text-dark">{role.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="border-0 py-3">
                            <span className="text-muted">{role.description}</span>
                          </td>
                          <td className="border-0 py-3">
                            <div className="d-flex flex-wrap gap-1">
                              {role.permissions && role.permissions.length > 0 ? (
                                <>
                                  {role.permissions.slice(0, 2).map((permission) => (
                                    <span key={permission.id} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2 py-1 small">
                                      {permission.name}
                                    </span>
                                  ))}
                                  {role.permissions.length > 2 && (
                                    <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill px-2 py-1 small">
                                      +{role.permissions.length - 2} more
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted small">No permissions</span>
                              )}
                            </div>
                          </td>
                          <td className="border-0 py-3">
                            <span className="text-muted small">{new Date(role.created_at).toLocaleDateString()}</span>
                          </td>
                          <td className="border-0 py-3 text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                onClick={() => handleEditRole(role)}
                                className="btn btn-outline-primary btn-sm rounded-pill shadow-sm"
                                title="Edit role"
                              >
                                <PencilIcon style={{width: '1rem', height: '1rem'}} />
                              </button>
                              <button
                                onClick={() => handleDeleteRole(role)}
                                className="btn btn-outline-danger btn-sm rounded-pill shadow-sm"
                                title="Delete role"
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

              {filteredRoles.length === 0 && (
                <div className="text-center py-5 fade-in">
                  <div className="mx-auto rounded-circle bg-light d-flex align-items-center justify-content-center mb-3" style={{width: '4rem', height: '4rem'}}>
                    <ShieldCheckIcon style={{width: '2rem', height: '2rem'}} className="text-muted" />
                  </div>
                  <h5 className="fw-medium text-dark mb-2">No roles found</h5>
                  <p className="text-muted small">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first role.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <RoleModal
          role={selectedRole}
          permissions={permissions}
          onClose={() => setIsModalOpen(false)}
          onSave={handleRoleSaved}
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
                <h5 className="fw-semibold text-dark mb-2">Delete Role</h5>
                <p className="text-muted small mb-4">
                  Are you sure you want to delete this role? This action cannot be undone.
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

export default RoleManagement;