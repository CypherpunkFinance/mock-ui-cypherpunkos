import React from 'react';

interface PageHeaderProps {
  title: string;
  userName?: string; 
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, userName = "User" }) => {
  return (
    <header className="main-header">
      <h2 id="current-page-title">{title}</h2>
      <div className="user-profile">
        <i className="ri-user-fill"></i>
        <span>{userName}</span>
      </div>
    </header>
  );
};

export default PageHeader; 