import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Dataset, PageSection } from '../types';
import { apiService } from '../services/api';
import Analytics from '../components/Analytics';
import Dashboard from '../components/Dashboard';
import Chat from '../components/Chat';
import DecisionMaker from '../components/DecisionMaker';
import Navigation from '../components/Navigation';
import './DatasetPage.css';

const DatasetPage = () => {
  const { datasetName } = useParams<{ datasetName: string }>();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [activeSection, setActiveSection] = useState<PageSection>('analytics');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (datasetName) {
      loadDataset(datasetName);
    }
  }, [datasetName]);

  const loadDataset = async (datasetId: string) => {
    setLoading(true);
    setError(null);
    
    const response = await apiService.getDataset(datasetId);
    if (response.success && response.data) {
      setDataset(response.data);
    } else {
      setError(response.error || 'Failed to load dataset');
    }
    setLoading(false);
  };

  const handleSectionChange = (section: PageSection) => {
    setActiveSection(section);
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dataset-page">
        <div className="loading-container">
          <div className="loading-spinner pulse"></div>
          <p>Loading dataset...</p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="dataset-page">
        <div className="error-container">
          <h2>Dataset Not Found</h2>
          <p>{error || 'The requested dataset could not be found.'}</p>
          <button className="btn" onClick={handleBackToLanding}>
            Back to Datasets
          </button>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    if (!datasetName) return null;

    switch (activeSection) {
      case 'analytics':
        return <Analytics datasetId={datasetName} />;
      case 'dashboard':
        return <Dashboard datasetId={datasetName} />;
      case 'chat':
        return <Chat datasetId={datasetName} />;
      case 'decision-maker':
        return <DecisionMaker datasetId={datasetName} />;
      default:
        return <Analytics datasetId={datasetName} />;
    }
  };

  return (
    <div className="dataset-page">
      <Navigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        datasetName={dataset.displayName}
        onBackToLanding={handleBackToLanding}
      />
      
      <main className="main-content">
        {/* <header className="dataset-header">
          <div className="dataset-info">
            <div className="dataset-icon-large">
              <span>{dataset.displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="dataset-details">
              <h1 className="dataset-title text-gradient">{dataset.displayName}</h1>
              <p className="dataset-description">{dataset.description}</p>
            </div>
          </div>
        </header> */}

        <div className="section-content">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
};

export default DatasetPage;
