import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Dataset } from '../types';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setLoading(true);
    const response = await apiService.getDatasets();
    if (response.success && response.data) {
      setDatasets(response.data);
    }
    setLoading(false);
  };

  const handleDatasetClick = (datasetName: string) => {
    navigate(`/dataset/${datasetName}`);
  };

  const handleAddYours = () => {
    setShowUploadModal(true);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const metadata = {
      displayName: file.name.replace(/\.[^/.]+$/, ""),
      description: 'Custom uploaded dataset',
    };

    const response = await apiService.uploadDataset(file, metadata);
    if (response.success && response.data) {
      setDatasets([...datasets, response.data]);
      setShowUploadModal(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <header className="landing-header">
          <button className="back-button" onClick={handleBackToHome}>
            <span className="back-icon">←</span>
            <span>Back to Home</span>
          </button>
          <h1 className="landing-title text-gradient fade-in-up">
            Select Dataset
          </h1>
          <p className="landing-subtitle fade-in-up">
            Choose a dataset to begin your analysis journey
          </p>
        </header>

        <main className="landing-main">
          <div className="dataset-section">
            <h2 className="section-title">Add Dataset</h2>
            
            <div className="dataset-grid">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner pulse"></div>
                  <p>Loading datasets...</p>
                </div>
              ) : (
                <>
                  {datasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      className="dataset-card card"
                      onClick={() => handleDatasetClick(dataset.name)}
                    >
                      <div className="dataset-icon">
                        <span className="dataset-letter">
                          {dataset.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="dataset-name">{dataset.displayName}</h3>
                      <p className="dataset-description">{dataset.description}</p>
                      {dataset.recordCount && (
                        <div className="dataset-stats">
                          <span className="record-count">
                            {dataset.recordCount.toLocaleString()} records
                          </span>
                          {dataset.lastUpdated && (
                            <span className="last-updated">
                              Updated: {dataset.lastUpdated}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div
                    className="dataset-card card add-yours-card"
                    onClick={handleAddYours}
                  >
                    <div className="add-icon">
                      <span>+</span>
                    </div>
                    <h3 className="dataset-name">Add Yours</h3>
                    <p className="dataset-description">
                      Upload your custom dataset for analysis
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        <footer className="landing-footer">
          <div className="footer-content">
            <p>&copy; 2024 CFOx.ai. Powered by AI.</p>
          </div>
        </footer>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Dataset</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-area">
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv,.json,.xlsx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="upload-label">
                  <div className="upload-icon">📁</div>
                  <p>Click to select a file</p>
                  <small>Supported formats: CSV, JSON, Excel</small>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
