import { useState } from 'react';
import type { PageSection, NavigationItem } from '../types';
import './Navigation.css';

interface NavigationProps {
  activeSection: PageSection;
  onSectionChange: (section: PageSection) => void;
  datasetName: string;
  onBackToLanding: () => void;
}

const Navigation = ({ 
  activeSection, 
  onSectionChange, 
  datasetName, 
  onBackToLanding 
}: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { id: 'analytics', label: 'Analytics', icon: '' },
    { id: 'dashboard', label: 'Dashboard', icon: '' },
    { id: 'chat', label: 'Chat', icon: '' },
    { id: 'decision-maker', label: 'Decision Maker', icon: '' },
  ];

  const toggleNavigation = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile navigation toggle */}
      <button 
        className="mobile-nav-toggle"
        onClick={toggleNavigation}
        aria-label="Toggle navigation"
      >
        <span className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Navigation sidebar */}
      <nav className={`nav-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <button className="back-button" onClick={onBackToLanding}>
            <span className="back-icon">←</span>
            <span>Back to Datasets</span>
          </button>
          <h2 className="nav-dataset-name">{datasetName}</h2>
        </div>

        <div className="nav-sections">
          <h3 className="nav-section-title">Sections</h3>
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsOpen(false); // Close mobile nav after selection
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-footer">
          <div className="nav-info">
            <p className="nav-info-title">CFOx.ai</p>
            <p className="nav-info-subtitle">AI-Powered Insights</p>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="nav-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
