import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import AppCard from '../components/AppCard';
import { appStoreMockData } from '../mockData';
import type { AppDefinition } from '../mockData';

const MAIN_CATEGORIES = ['All', 'App', 'Chain', 'Theme'];

const AppStorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);

  useEffect(() => {
    let subCategories: string[] = [];
    if (selectedMainCategory === 'All') {
      // Show all unique sub-categories from the entire dataset
      subCategories = [...new Set(appStoreMockData.map(app => app.category))];
    } else {
      // Filter apps by main category first
      const appsInMainCategory = appStoreMockData.filter(app => app.mainCategory === selectedMainCategory);
      // Then get unique sub-categories from that filtered list
      subCategories = [...new Set(appsInMainCategory.map(app => app.category))];
    }
    setAvailableSubCategories(['All', ...subCategories.sort()]);
    setSelectedSubCategory('All'); // Reset sub-category when main category changes
  }, [selectedMainCategory]);

  const filteredApps = useMemo(() => {
    return appStoreMockData.filter(app => {
      const matchesSearch = searchTerm === '' || 
                            app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (app.subName && app.subName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesMainCategory = selectedMainCategory === 'All' || app.mainCategory === selectedMainCategory;
      
      const matchesSubCategory = selectedSubCategory === 'All' || app.category === selectedSubCategory;

      return matchesSearch && matchesMainCategory && matchesSubCategory;
    });
  }, [searchTerm, selectedMainCategory, selectedSubCategory]);

  const handleInstallApp = (appId: string) => {
    alert(`Mock: Initiating install for ${appId}.`);
  };

  return (
    <>
      <PageHeader title="App Store" />
      <div className="content-page">
        <div className="app-store-controls card" style={{ padding: 'var(--padding-md)', marginBottom: 'var(--padding-md)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="search" 
            placeholder="Search apps..." 
            className="input-mock" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flexGrow: 1, minWidth: '200px' }} 
          />
          <div style={{display: 'flex', gap: '1rem'}}>
            <select 
              className="input-mock filter-mock"
              value={selectedMainCategory}
              onChange={(e) => setSelectedMainCategory(e.target.value)}
              style={{minWidth: '150px'}}
            >
              {MAIN_CATEGORIES.map(category => (
                <option key={category} value={category}>{category === 'All' ? 'Category' : category}</option>
              ))}
            </select>
            <select 
              className="input-mock filter-mock"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              disabled={selectedMainCategory === 'All' && availableSubCategories.length <=1 } // Disable if only "All" is available due to no main category selected
              style={{minWidth: '180px'}}
            >
              {availableSubCategories.map(category => (
                <option key={category} value={category}>{category === 'All' ? 'Sub Category' : category}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredApps.length > 0 ? (
          <div className="grid-container app-store-grid">
            {filteredApps.map(app => (
              <AppCard key={app.id} app={app} onInstall={handleInstallApp} isInstalledView={false} />
            ))}
          </div>
        ) : (
          <div className="card" style={{padding: 'var(--padding-lg)', textAlign: 'center'}}>
            <p>No applications found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AppStorePage; 