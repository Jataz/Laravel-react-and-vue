import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  UsersIcon,
  ShieldCheckIcon,
  KeyIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const { hasPermission } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: location.pathname === '/dashboard' },
    ...(hasPermission('manage_users') ? [
      { name: 'Users', href: '/users', icon: UsersIcon, current: location.pathname.startsWith('/users') },
    ] : []),
    ...(hasPermission('manage_roles') ? [
      { name: 'Roles', href: '/roles', icon: ShieldCheckIcon, current: location.pathname.startsWith('/roles') },
    ] : []),
    ...(hasPermission('manage_permissions') ? [
      { name: 'Permissions', href: '/permissions', icon: KeyIcon, current: location.pathname.startsWith('/permissions') },
    ] : []),
  ];

  return (
    <div className={`position-fixed top-0 start-0 bottom-0 z-3 ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} transition-all`} style={{zIndex: 1050}}>
      {/* Sidebar */}
      <div className="d-flex flex-column h-100 sidebar-gradient shadow-lg">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-25">
          {!isCollapsed && (
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center justify-content-center primary-gradient rounded-3" style={{width: '2rem', height: '2rem'}}>
                <span className="text-white fw-bold small">A</span>
              </div>
              <h1 className="h5 fw-bold text-white mb-0">
                Admin Panel
              </h1>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn btn-outline-light btn-sm rounded-3 hover-scale"
            style={{border: 'none', backgroundColor: 'rgba(255,255,255,0.1)'}}
          >
            {isCollapsed ? (
              <ChevronRightIcon style={{width: '1.25rem', height: '1.25rem'}} />
            ) : (
              <ChevronLeftIcon style={{width: '1.25rem', height: '1.25rem'}} />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow-1 px-3 py-4">
          <div className="d-flex flex-column gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`d-flex align-items-center px-3 py-3 text-decoration-none rounded-3 transition-all hover-lift ${
                  item.current
                    ? 'primary-gradient text-white shadow-sm'
                    : 'text-light hover-bg-light'
                }`}
                style={{
                  backgroundColor: item.current ? '' : 'transparent'
                }}
              >
                <item.icon 
                  className={`${isCollapsed ? 'mx-auto' : 'me-3'} ${
                    item.current ? 'text-white' : 'text-light'
                  }`}
                  style={{width: '1.25rem', height: '1.25rem'}}
                />
                {!isCollapsed && (
                  <span className="fw-medium">{item.name}</span>
                )}
                {item.current && !isCollapsed && (
                  <div className="ms-auto bg-white rounded-circle" style={{width: '0.5rem', height: '0.5rem'}}></div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="border-top border-secondary border-opacity-25 p-3">
          <div className="position-relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`btn w-100 d-flex align-items-center ${isCollapsed ? 'justify-content-center' : 'gap-3'} p-3 rounded-3 hover-lift`}
              style={{backgroundColor: 'rgba(255,255,255,0.1)', border: 'none'}}
            >
              <div className="d-flex align-items-center justify-content-center primary-gradient rounded-circle flex-shrink-0" style={{width: '2rem', height: '2rem'}}>
                <UserIcon className="text-white" style={{width: '1.25rem', height: '1.25rem'}} />
              </div>
              {!isCollapsed && (
                <div className="flex-grow-1 text-start">
                  <div className="small fw-medium text-white text-truncate">{user?.name}</div>
                  <div className="text-light text-truncate" style={{fontSize: '0.75rem'}}>{user?.email}</div>
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className={`position-absolute ${isCollapsed ? 'start-100 bottom-0' : 'end-0'} bg-white rounded-3 shadow-lg border py-2 z-3`} 
                   style={{
                     width: '12rem',
                     bottom: isCollapsed ? '0' : '4rem',
                     left: isCollapsed ? '1rem' : 'auto'
                   }}>
                <div className="px-3 py-2 border-bottom">
                  <div className="small fw-medium text-dark">{user?.name}</div>
                  <div className="text-muted" style={{fontSize: '0.75rem'}}>{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-link w-100 d-flex align-items-center px-3 py-2 text-start text-decoration-none text-dark hover-bg-light"
                  style={{border: 'none'}}
                >
                  <ArrowRightOnRectangleIcon className="me-3 text-muted" style={{width: '1rem', height: '1rem'}} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {userMenuOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25" 
          style={{zIndex: 1040}}
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Navigation;