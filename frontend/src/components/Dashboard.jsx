import React, { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, rolesAPI, permissionsAPI } from '../services/api';
import Navigation from './layout/Navigation';
import {
  UsersIcon,
  ShieldCheckIcon,
  KeyIcon,
  UserCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    permissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (isAdmin()) {
        try {
          const [usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
            usersAPI.getAll(),
            rolesAPI.getAll(),
            permissionsAPI.getAll(),
          ]);

          setStats({
            users: usersResponse.data.data?.length || 0,
            roles: rolesResponse.data.data?.length || 0,
            permissions: permissionsResponse.data.data?.length || 0,
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
      setLoading(false);
    };

    fetchStats();
  }, [isAdmin]);

  const statCards = [
    {
      name: 'Total Users',
      value: stats.users,
      icon: UsersIcon,
      gradient: 'primary-gradient',
      bgGradient: 'primary-bg-gradient',
      iconBg: 'primary-gradient',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Total Roles',
      value: stats.roles,
      icon: ShieldCheckIcon,
      gradient: 'success-gradient',
      bgGradient: 'success-bg-gradient',
      iconBg: 'success-gradient',
      change: '+5%',
      changeType: 'increase',
    },
    {
      name: 'Total Permissions',
      value: stats.permissions,
      icon: KeyIcon,
      gradient: 'secondary-gradient',
      bgGradient: 'secondary-bg-gradient',
      iconBg: 'secondary-gradient',
      change: '+8%',
      changeType: 'increase',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Add, edit, or remove user accounts',
      href: '/users',
      icon: UsersIcon,
      gradient: 'primary-gradient',
      permission: 'manage_users',
    },
    {
      title: 'Manage Roles',
      description: 'Configure user roles and permissions',
      href: '/roles',
      icon: ShieldCheckIcon,
      gradient: 'success-gradient',
      permission: 'manage_roles',
    },
    {
      title: 'Manage Permissions',
      description: 'Set up system permissions',
      href: '/permissions',
      icon: KeyIcon,
      gradient: 'secondary-gradient',
      permission: 'manage_permissions',
    },
  ];

  const { hasPermission } = useAuth();

  return (
    <div className="min-vh-100 gradient-bg">
      <Navigation onToggle={setSidebarCollapsed} />
      
      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="container-fluid py-4 px-4">
          {/* Header */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h1 className="display-4 fw-bold text-dark mb-2">
                  Dashboard
                </h1>
                <p className="fs-5 text-muted">Welcome back, {user?.name}! 👋</p>
              </div>
              <div className="text-end">
                <div className="small text-muted">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="card glass-card shadow-lg border-0 rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="d-flex align-items-center justify-content-center primary-gradient rounded-4 shadow-lg" style={{width: '4rem', height: '4rem'}}>
                    <UserCircleIcon className="text-white" style={{width: '2rem', height: '2rem'}} />
                  </div>
                </div>
                <div className="ms-4">
                  <h3 className="h4 fw-bold text-dark">{user?.name}</h3>
                  <p className="text-muted fs-5">{user?.email}</p>
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {user?.roles?.map((role) => (
                      <span
                        key={role.id}
                        className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-medium"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - Only for Admins */}
          {isAdmin() && (
            <>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="h3 fw-bold text-dark">System Overview</h2>
                <div className="d-flex align-items-center gap-2 small text-muted">
                  <ChartBarIcon style={{width: '1rem', height: '1rem'}} />
                  <span>Real-time data</span>
                </div>
              </div>
              
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{height: '8rem'}}>
                  <div className="position-relative">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row g-4 mb-4">
                  {statCards.map((stat, index) => (
                    <div key={stat.name} className="col-12 col-sm-6 col-lg-4">
                      <div className="card glass-card border-0 rounded-4 shadow-lg hover-lift h-100">
                        <div className={`position-absolute top-0 start-0 w-100 h-100 ${stat.bgGradient} opacity-50 rounded-4`}></div>
                        <div className="card-body p-4 position-relative">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="flex-grow-1">
                              <p className="small fw-medium text-muted text-uppercase mb-2">
                                {stat.name}
                              </p>
                              <p className="display-6 fw-bold text-dark mb-2">
                                {stat.value}
                              </p>
                              <div className="d-flex align-items-center">
                                <ArrowTrendingUpIcon className="text-success me-1" style={{width: '1rem', height: '1rem'}} />
                                <span className="small fw-medium text-success">
                                  {stat.change}
                                </span>
                                <span className="small text-muted ms-1">vs last month</span>
                              </div>
                            </div>
                            <div className={`d-flex align-items-center justify-content-center ${stat.iconBg} rounded-3 shadow-sm hover-scale`} style={{width: '3rem', height: '3rem'}}>
                              <stat.icon className="text-white" style={{width: '1.5rem', height: '1.5rem'}} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Quick Actions */}
          <div className="card glass-card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="h4 fw-bold text-dark">Quick Actions</h3>
                <EyeIcon className="text-muted" style={{width: '1.25rem', height: '1.25rem'}} />
              </div>
              <div className="row g-4">
                {quickActions.map((action, index) => (
                  hasPermission(action.permission) && (
                    <div key={action.title} className="col-12 col-sm-6 col-lg-4">
                      <a
                        href={action.href}
                        className="card glass-card border-0 rounded-3 text-decoration-none hover-lift h-100"
                      >
                        <div className="card-body p-4">
                          <div className="d-flex align-items-start gap-3">
                            <div className={`d-flex align-items-center justify-content-center ${action.gradient} rounded-3 shadow-sm hover-scale`} style={{width: '2.5rem', height: '2.5rem'}}>
                              <action.icon className="text-white" style={{width: '1.25rem', height: '1.25rem'}} />
                            </div>
                            <div className="flex-grow-1">
                              <h4 className="h6 fw-semibold text-dark mb-1">
                                {action.title}
                              </h4>
                              <p className="small text-muted mb-0">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="card glass-card shadow-lg border-0 rounded-4 mt-4">
            <div className="card-body p-4">
              <h3 className="h4 fw-bold text-dark mb-4">Recent Activity</h3>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3 p-3 bg-light bg-opacity-50 rounded-3">
                  <div className="bg-primary rounded-circle" style={{width: '0.5rem', height: '0.5rem'}}></div>
                  <div className="flex-grow-1">
                    <p className="small fw-medium text-dark mb-0">System initialized successfully</p>
                    <p className="text-muted mb-0" style={{fontSize: '0.75rem'}}>2 minutes ago</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 p-3 bg-light bg-opacity-50 rounded-3">
                  <div className="bg-success rounded-circle" style={{width: '0.5rem', height: '0.5rem'}}></div>
                  <div className="flex-grow-1">
                    <p className="small fw-medium text-dark mb-0">User {user?.name} logged in</p>
                    <p className="text-muted mb-0" style={{fontSize: '0.75rem'}}>5 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;