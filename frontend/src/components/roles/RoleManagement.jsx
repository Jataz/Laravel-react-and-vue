import React, { useState, useEffect } from 'react';
import { rolesAPI, permissionsAPI } from '../../services/api';
import Navigation from '../layout/Navigation';
import RoleModal from './RoleModal';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await rolesAPI.getAll();
      setRoles(response.data.data || []);
    } catch (error) {
      setError('Failed to fetch roles');
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await permissionsAPI.getAll();
      setPermissions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
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

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await rolesAPI.delete(roleId);
        setRoles(roles.filter(role => role.id !== roleId));
      } catch (error) {
        setError('Failed to delete role');
        console.error('Error deleting role:', error);
      }
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

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navigation onToggle={setSidebarCollapsed} />
        <div className={`d-flex align-items-center justify-content-center main-content ${sidebarCollapsed ? 'collapsed' : ''}`} style={{height: '16rem'}}>
          <div className="spinner-border text-primary" style={{width: '8rem', height: '8rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient-primary">
      <Navigation onToggle={setSidebarCollapsed} />
      
      <div className={`container-fluid py-4 main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="px-3 py-4">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
            <div className="flex-grow-1">
              <h1 className="display-5 fw-bold text-gradient mb-2">Roles</h1>
              <p className="text-muted small">
                Manage user roles and their associated permissions.
              </p>
            </div>
            <div className="mt-3 mt-sm-0">
              <button
                type="button"
                onClick={handleCreateRole}
                className="btn btn-primary btn-lg d-inline-flex align-items-center shadow-lg"
                style={{borderRadius: '0.75rem'}}
              >
                <PlusIcon className="me-2" style={{width: '1rem', height: '1rem'}} />
                Add Role
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mt-4 shadow-sm" style={{borderRadius: '0.75rem'}}>
              {error}
            </div>
          )}

          {/* Search */}
          <div className="mt-4">
            <div className="position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                <MagnifyingGlassIcon style={{width: '1.25rem', height: '1.25rem'}} className="text-muted" />
              </div>
              <input
                type="text"
                className="form-control form-control-lg ps-5 shadow-sm"
                style={{borderRadius: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.9)'}}
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Roles Grid */}
          <div className="mt-5 row g-4">
            {filteredRoles.map((role) => (
              <div key={role.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-lg border-0 card-hover" style={{borderRadius: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.9)'}}>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-gradient-purple d-flex align-items-center justify-content-center shadow-lg" style={{width: '3rem', height: '3rem'}}>
                          <ShieldCheckIcon style={{width: '1.5rem', height: '1.5rem'}} className="text-white" />
                        </div>
                        <div className="ms-3">
                          <h5 className="card-title mb-0 fw-semibold text-primary">
                            {role.name}
                          </h5>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="btn btn-outline-primary btn-sm rounded-pill"
                          title="Edit role"
                        >
                          <PencilIcon style={{width: '1rem', height: '1rem'}} />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="btn btn-outline-danger btn-sm rounded-pill"
                          title="Delete role"
                        >
                          <TrashIcon style={{width: '1rem', height: '1rem'}} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="card-text text-muted small mb-3">
                      {role.description || 'No description provided'}
                    </p>
                    
                    <div>
                      <div className="mb-3">
                        <span className="text-uppercase fw-medium text-muted" style={{fontSize: '0.75rem', letterSpacing: '0.05em'}}>Permissions</span>
                        <div className="mt-2 d-flex flex-wrap gap-1">
                          {role.permissions && role.permissions.length > 0 ? (
                            role.permissions.slice(0, 3).map((permission) => (
                              <span
                                key={permission.id}
                                className="badge bg-success-subtle text-success border border-success-subtle"
                                style={{borderRadius: '1rem'}}
                              >
                                {permission.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted" style={{fontSize: '0.75rem'}}>No permissions assigned</span>
                          )}
                          {role.permissions && role.permissions.length > 3 && (
                            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle" style={{borderRadius: '1rem'}}>
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-3 border-top">
                        <span className="text-muted" style={{fontSize: '0.75rem'}}>
                          Created {new Date(role.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-5">
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

      {isModalOpen && (
        <RoleModal
          role={selectedRole}
          permissions={permissions}
          onClose={() => setIsModalOpen(false)}
          onSave={handleRoleSaved}
        />
      )}
    </div>
  );
};

export default RoleManagement;