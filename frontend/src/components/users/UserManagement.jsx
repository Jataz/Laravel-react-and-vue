import React, { useState, useEffect } from 'react';
import { usersAPI, rolesAPI } from '../../services/api';
import UserModal from './UserModal';
import Navigation from '../layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const UserManagement = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both users and roles concurrently
      const [usersResponse, rolesResponse] = await Promise.allSettled([
        usersAPI.getAll(),
        rolesAPI.getAll()
      ]);

      if (usersResponse.status === 'fulfilled') {
        setUsers(usersResponse.value.data.data || []);
      } else {
        console.error('Error fetching users:', usersResponse.reason);
        setError('Failed to load users. Please try again.');
      }

      if (rolesResponse.status === 'fulfilled') {
        setRoles(rolesResponse.value.data.data || []);
      } else {
        console.error('Error fetching roles:', rolesResponse.reason);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
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

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await usersAPI.delete(userToDelete);
      setUsers(users.filter(user => user.id !== userToDelete));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setError('');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
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
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!hasPermission('view users')) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <ShieldCheckIcon style={{width: '3rem', height: '3rem'}} className="text-muted mx-auto mb-3" />
          <h3 className="fw-medium text-dark mb-2">Access Denied</h3>
          <p className="text-muted small">
            You don't have permission to manage users.
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
                <h1 className="display-5 fw-bold text-gradient mb-2">Users</h1>
                <p className="text-muted small">
                  Manage user accounts, roles, and permissions.
                </p>
              </div>
              <div className="mt-3 mt-sm-0">
                <button
                  type="button"
                  onClick={handleCreateUser}
                  className="btn btn-primary btn-lg d-inline-flex align-items-center shadow-lg"
                >
                  <PlusIcon style={{width: '1.25rem', height: '1.25rem'}} className="me-2" />
                  Add User
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="card shadow-lg border-0 bg-white bg-opacity-90" style={{borderRadius: '1rem'}}>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-uppercase fw-semibold text-muted small border-0">
                        User
                      </th>
                      <th className="px-4 py-3 text-uppercase fw-semibold text-muted small border-0">
                        Roles
                      </th>
                      <th className="px-4 py-3 text-uppercase fw-semibold text-muted small border-0">
                        Created
                      </th>
                      <th className="px-4 py-3 border-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-0">
                        <td className="px-4 py-4 border-0">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center shadow-sm me-3" style={{width: '2.5rem', height: '2.5rem'}}>
                              <span className="text-white fw-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">{user.name || 'Unknown'}</div>
                              <div className="text-muted small">{user.email || 'No email'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 border-0">
                          <div className="d-flex flex-wrap gap-1">
                            {user.roles?.map((role) => (
                              <span
                                key={role.id}
                                className="badge bg-primary-subtle text-primary border border-primary-subtle"
                                style={{borderRadius: '1rem'}}
                              >
                                {role.name}
                              </span>
                            )) || (
                              <span className="text-muted small">No roles</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 border-0 text-muted small">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="px-4 py-4 border-0">
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="btn btn-sm btn-outline-primary border-0 hover-scale"
                              title="Edit user"
                            >
                              <PencilIcon style={{width: '1rem', height: '1rem'}} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="btn btn-sm btn-outline-danger border-0 hover-scale"
                              title="Delete user"
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

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="fw-medium text-dark mb-2">Loading users...</h5>
                <p className="text-muted small">Please wait while we fetch the data.</p>
              </div>
            ) : filteredUsers.length === 0 && (
              <div className="text-center py-5 fade-in">
                <div className="mx-auto rounded-circle bg-light d-flex align-items-center justify-content-center mb-3" style={{width: '4rem', height: '4rem'}}>
                  <UserIcon style={{width: '2rem', height: '2rem'}} className="text-muted" />
                </div>
                <h5 className="fw-medium text-dark mb-2">No users found</h5>
                <p className="text-muted small">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first user.'}
                </p>
              </div>
            )}
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

      {isDeleteModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0" style={{borderRadius: '1rem'}}>
              <div className="modal-body text-center p-4">
                <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 mb-4" style={{width: '3rem', height: '3rem'}}>
                  <ExclamationTriangleIcon style={{width: '1.5rem', height: '1.5rem'}} className="text-danger" />
                </div>
                <h5 className="fw-semibold text-dark mb-2">Delete User</h5>
                <p className="text-muted small mb-4">
                  Are you sure you want to delete this user? This action cannot be undone.
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

export default UserManagement;