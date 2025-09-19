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

const Navigation = ({ onToggle }) => {
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
    ...(hasPermission('view users') || isAdmin() ? [
      { name: 'Users', href: '/users', icon: UsersIcon, current: location.pathname === '/users' }
    ] : []),
    ...(hasPermission('view roles') || isAdmin() ? [
      { name: 'Roles', href: '/roles', icon: ShieldCheckIcon, current: location.pathname === '/roles' }
    ] : []),
    ...(hasPermission('view permissions') || isAdmin() ? [
      { name: 'Permissions', href: '/permissions', icon: KeyIcon, current: location.pathname === '/permissions' }
    ] : []),
  ];

  return (
    <div className={`position-fixed top-0 start-0 bottom-0 ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} transition-all`} style={{zIndex: 1050}}>
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
            onClick={() => {
              const newCollapsed = !isCollapsed;
              setIsCollapsed(newCollapsed);
              onToggle?.(newCollapsed);
            }}
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
              className={`btn w-100 d-flex align-items-center ${isCollapsed ? 'justify-content-center' : ''} p-3 rounded-3 shadow-lg`}
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                gap: isCollapsed ? '0' : '0.75rem'
              }}
            >
              <div className="d-flex align-items-center justify-content-center primary-gradient rounded-circle flex-shrink-0 shadow-lg" 
                   style={{
                     width: '2.5rem', 
                     height: '2.5rem',
                     background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                     boxShadow: '0 0 0 2px rgba(255,255,255,0.2)'
                   }}>
                <UserIcon className="text-white" style={{width: '1.25rem', height: '1.25rem'}} />
              </div>
              {!isCollapsed && (
                <div className="flex-grow-1 text-start">
                  <div className="small fw-bold text-white text-truncate" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>{user?.name}</div>
                  <div className="text-light text-truncate opacity-75" style={{fontSize: '0.75rem'}}>{user?.email}</div>
                </div>
              )}
              {!isCollapsed && (
                <div className="flex-shrink-0">
                  <ChevronRightIcon 
                    className="text-light" 
                    style={{
                      width: '1rem', 
                      height: '1rem',
                      transform: userMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className={`position-absolute ${isCollapsed ? '' : 'end-0'} bg-white rounded-3 shadow-lg border overflow-hidden`} 
                   style={{
                     width: '14rem',
                     bottom: isCollapsed ? '0' : '4rem',
                     left: isCollapsed ? '100%' : 'auto',
                     marginLeft: isCollapsed ? '1rem' : '0',
                     boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                     zIndex: 1050
                   }}>
                <div className="px-4 py-3 border-bottom" 
                     style={{
                       background: 'linear-gradient(90deg, #eff6ff, #faf5ff)'
                     }}>
                  <div className="small fw-bold text-dark text-truncate">{user?.name}</div>
                  <div className="text-muted text-truncate" style={{fontSize: '0.75rem', marginTop: '0.125rem'}}>{user?.email}</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="btn w-100 d-flex align-items-center text-start px-4 py-3 text-secondary border-0 rounded-0"
                    style={{
                      transition: 'all 0.15s ease',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fef2f2';
                      e.target.style.color = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6c757d';
                    }}
                  >
                    <ArrowRightOnRectangleIcon 
                      className="text-muted" 
                      style={{width: '1rem', height: '1rem'}} 
                    />
                    <span className="fw-medium">Sign out</span>
                  </button>
                </div>
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