import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// We'll define NavItem props later if it becomes a separate component with more logic
// For now, keeping it simple
interface NavItemProps {
  iconClass: string;
  label: string;
  targetPath: string; // Changed from target to targetPath for clarity with Link's 'to' prop
}

const NavItem: React.FC<NavItemProps> = ({ iconClass, label, targetPath }) => {
  const location = useLocation();
  const isActive = location.pathname === targetPath || (targetPath === '/logs' && location.pathname.startsWith('/logs'));

  return (
    <li className={`nav-item ${isActive ? 'active' : ''}`}>
      <Link to={targetPath}>
        <i className={iconClass}></i> {/* Placeholder for actual icon component or direct class usage */}
        <span>{label}</span>
      </Link>
    </li>
  );
};

const Sidebar: React.FC = () => {
  // Paths should now start with a slash for react-router-dom
  const navItemsData: Omit<NavItemProps, 'isActive'>[] = [
    { iconClass: 'ri-dashboard-line', label: 'Dashboard', targetPath: '/dashboard' },
    { iconClass: 'ri-wallet-3-line', label: 'Wallet', targetPath: '/wallet' },
    { iconClass: 'ri-link-m', label: 'Chains', targetPath: '/chains' },
    { iconClass: 'ri-store-2-line', label: 'App Store', targetPath: '/app-store' },
    { iconClass: 'ri-apps-line', label: 'Installed Apps', targetPath: '/installed-apps' },
    { iconClass: 'ri-settings-3-line', label: 'Settings', targetPath: '/settings' },
    { iconClass: 'ri-file-text-line', label: 'Log Viewer', targetPath: '/logs' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <i className="ri-shield-keyhole-line ri-xl"></i> {/* Placeholder */}
        <h1>CypherpunkOS</h1>
      </div>
      <ul className="nav-menu">
        {navItemsData.map((item) => (
          <NavItem key={item.targetPath} {...item} />
        ))}
      </ul>
      <div className="sidebar-footer">
        <p>&copy; 2024 CypherpunkOS</p>
      </div>
    </nav>
  );
};

export default Sidebar; 