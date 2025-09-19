import React, { useState, useEffect } from 'react';
import { usersAPI, rolesAPI } from '../../services/api';
import Navigation from '../layout/Navigation';
import UserModal from './UserModal';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await rolesAPI.getAll();
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setDeletingUserId(userId);
      await usersAPI.delete(userId);
      setUsers(users.filter(user => user.id !== userId));
      setError('');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleUserSaved = (savedUser) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === savedUser.id ? savedUser : user
      ));
    } else {
      // Add new user
      setUsers([...users, savedUser]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton loader component
  const SkeletonRow = () => (
    <tr className="skeleton-loading">
      <td className="px-3 py-4">
        <div className="d-flex align-items-center">
          <div className="skeleton-avatar rounded-circle me-3"></div>
          <div>
            <div className="skeleton-text mb-2" style={{ width: '120px' }}></div>
            <div className="skeleton-text" style={{ width: '160px' }}></div>
          </div>
        </div>
      </td>
      <td className="px-3 py-4">
        <div className="d-flex gap-2">
          <div className="skeleton-badge" style={{ width: '64px' }}></div>
          <div className="skeleton-badge" style={{ width: '80px' }}></div>
        </div>
      </td>
      <td className="px-3 py-4">
        <div className="skeleton-text" style={{ width: '80px' }}></div>
      </td>
      <td className="px-3 py-4 text-end">
        <div className="d-flex justify-content-end gap-2">
          <div className="skeleton-button"></div>
          <div className="skeleton-button"></div>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="min-vh-100 bg-gradient-primary">
        <Navigation onToggle={setSidebarCollapsed} />
        <div className={`container-fluid py-4 main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              {/* Header Skeleton */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <div className="skeleton-text mb-2" style={{ width: '128px', height: '32px' }}></div>
                  <div className="skeleton-text" style={{ width: '256px' }}></div>
                </div>
                <div className="d-none d-sm-block">
                  <div className="skeleton-button" style={{ width: '128px', height: '48px' }}></div>
                </div>
              </div>

              {/* Search Skeleton */}
              <div className="mb-4">
                <div className="skeleton-text" style={{ height: '48px' }}></div>
              </div>

              {/* Table Skeleton */}
              <div className="card shadow-lg border-0 bg-white bg-opacity-90">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-3 py-3 text-uppercase fw-semibold text-muted small">User</th>
                        <th className="px-3 py-3 text-uppercase fw-semibold text-muted small">Roles</th>
                        <th className="px-3 py-3 text-uppercase fw-semibold text-muted small">Created</th>
                        <th className="px-3 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, index) => (
                        <SkeletonRow key={index} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient-primary">
      <Navigation onToggle={setSidebarCollapsed} />
      
      <div className={`container-fluid py-4 main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-4">
              <div className="mb-3 mb-sm-0">
                <h1 className="display-6 fw-bold text-gradient fade-in mb-2">
                  Users
                </h1>
                <p className="text-muted fade-in" style={{ animationDelay: '100ms' }}>
                  Manage user accounts, roles, and permissions.
                </p>
              </div>
              <div className="fade-in" style={{ animationDelay: '200ms' }}>
                <button
                  type="button"
                  onClick={handleCreateUser}
                  disabled={actionLoading}
                  className="btn btn-gradient-primary btn-lg d-flex align-items-center shadow-lg"
                >
                  <PlusIcon className="me-2" style={{ width: '16px', height: '16px' }} />
                  Add User
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4 slide-up border-0 shadow-sm">
                <ExclamationTriangleIcon className="me-2 flex-shrink-0" style={{ width: '20px', height: '20px' }} />
                {error}
              </div>
            )}

            {/* Search */}
            <div className="mb-4 fade-in" style={{ animationDelay: '300ms' }}>
              <div className="position-relative">
                <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                  <MagnifyingGlassIcon className="text-muted" style={{ width: '20px', height: '20px' }} />
                </div>
                <input
                  type="text"
                  className="form-control form-control-lg ps-5 border-0 shadow-sm bg-white bg-opacity-75"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ backdropFilter: 'blur(10px)' }}
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="fade-in" style={{ animationDelay: '400ms' }}>
              <div className="card shadow-lg border-0 bg-white bg-opacity-90" style={{ backdropFilter: 'blur(10px)' }}>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-3 py-3 text-uppercase fw-semibold text-muted small border-0">
                          User
                        </th>
                        <th className="px-3 py-3 text-uppercase fw-semibold text-muted small border-0">
                          Roles
                        </th>
                        <th className="px-3 py-3 text-uppercase fw-semibold text-muted small border-0">
                          Created
                        </th>
                        <th className="px-3 py-3 border-0"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr 
                          key={user.id} 
                          className="table-row-hover slide-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-3 py-4 border-0">
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <div className="avatar-gradient d-flex align-items-center justify-content-center shadow-sm">
                                  <span className="fw-semibold text-white small">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold text-dark mb-1">
                                  {user.name}
                                </div>
                                <div className="text-muted small">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 border-0">
                            <div className="d-flex flex-wrap gap-2">
                              {user.roles?.map((role, roleIndex) => (
                                <span
                                  key={role.id}
                                  className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 scale-in"
                                  style={{ animationDelay: `${(index * 50) + (roleIndex * 25)}ms` }}
                                >
                                  {role.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-4 border-0 text-muted small">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-4 border-0">
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                disabled={deletingUserId === user.id || actionLoading}
                                className="btn btn-sm btn-outline-primary border-0 hover-scale"
                                title="Edit user"
                              >
                                <PencilIcon style={{ width: '16px', height: '16px' }} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={deletingUserId === user.id || actionLoading}
                                className="btn btn-sm btn-outline-danger border-0 hover-scale position-relative"
                                title="Delete user"
                              >
                                {deletingUserId === user.id ? (
                                  <div className="spinner-border spinner-border-sm text-danger" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                ) : (
                                  <TrashIcon style={{ width: '16px', height: '16px' }} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredUsers.length === 0 && !loading && (
                    <div className="text-center py-5 fade-in">
                      <div className="mx-auto mb-3 d-flex align-items-center justify-content-center scale-in" 
                           style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', borderRadius: '50%' }}>
                        {searchTerm ? (
                          <MagnifyingGlassIcon className="text-muted" style={{ width: '32px', height: '32px' }} />
                        ) : (
                          <UserIcon className="text-muted" style={{ width: '32px', height: '32px' }} />
                        )}
                      </div>
                      <h5 className="fw-semibold text-dark mb-2">No users found</h5>
                      <p className="text-muted mb-3">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first user.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={handleCreateUser}
                          className="btn btn-primary d-inline-flex align-items-center hover-scale"
                        >
                          <PlusIcon className="me-2" style={{ width: '16px', height: '16px' }} />
                          Add your first user
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          roles={roles}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUserSaved}
        />
      )}
    </div>
  );
};

export default UserManagement;