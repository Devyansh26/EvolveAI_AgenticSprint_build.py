import { useState, useEffect } from 'react';
import type { DecisionData } from '../types';
import { apiService } from '../services/api';
import './DecisionMaker.css';

interface DecisionMakerProps {
  datasetId: string;
}

const DecisionMaker = ({ datasetId }: DecisionMakerProps) => {
  const [decisionData, setDecisionData] = useState<DecisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  useEffect(() => {
    loadDecisionData();
  }, [datasetId]);

  const loadDecisionData = async () => {
    setLoading(true);
    setError(null);

    const response = await apiService.getDecisionData(datasetId);
    if (response.success && response.data) {
      setDecisionData(response.data);
    } else {
      setError(response.error || 'Failed to load decision data');
    }
    setLoading(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff88';
      default: return '#cccccc';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff88';
      default: return '#cccccc';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff88';
      default: return '#cccccc';
    }
  };

  if (loading) {
    return (
      <div className="section-container">
        <div className="loading-state">
          <div className="loading-spinner pulse"></div>
          <p>Loading decision analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !decisionData) {
    return (
      <div className="section-container">
        <div className="error-state">
          <h3>Failed to Load Decision Analysis</h3>
          <p>{error}</p>
          <button className="btn" onClick={loadDecisionData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">Decision Maker</h2>
        <p className="section-subtitle">
          AI-powered decision analysis and strategic recommendations for {datasetId} dataset
        </p>
      </div>

      {/* Scenarios Section */}
      <div className="scenarios-section">
        <h3 className="subsection-title">Scenario Analysis</h3>
        <div className="scenarios-grid">
          {decisionData.scenarios.map((scenario) => (
            <div 
              key={scenario.id} 
              className={`scenario-card ${selectedScenario === scenario.id ? 'selected' : ''}`}
              onClick={() => setSelectedScenario(
                selectedScenario === scenario.id ? null : scenario.id
              )}
            >
              <div className="scenario-header">
                <h4 className="scenario-title">{scenario.name}</h4>
                <div className="scenario-metrics">
                  <div className="probability-badge">
                    {scenario.probability}% probability
                  </div>
                  <div 
                    className="impact-badge"
                    style={{ color: getImpactColor(scenario.impact) }}
                  >
                    {scenario.impact} impact
                  </div>
                </div>
              </div>
              
              <p className="scenario-description">{scenario.description}</p>
              
              {selectedScenario === scenario.id && (
                <div className="scenario-details">
                  <h5>Expected Outcomes:</h5>
                  <ul className="outcomes-list">
                    {scenario.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="scenario-footer">
                <div className="probability-bar">
                  <div 
                    className="probability-fill"
                    style={{ width: `${scenario.probability}%` }}
                  ></div>
                </div>
                <span className="expand-indicator">
                  {selectedScenario === scenario.id ? '▼' : '▶'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="recommendations-section">
        <h3 className="subsection-title">Strategic Recommendations</h3>
        <div className="recommendations-list">
          {decisionData.recommendations.map((recommendation) => (
            <div key={recommendation.id} className="recommendation-card">
              <div className="recommendation-header">
                <div className="recommendation-title-section">
                  <h4 className="recommendation-title">{recommendation.title}</h4>
                  <div className="recommendation-badges">
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(recommendation.priority) }}
                    >
                      {recommendation.priority} priority
                    </span>
                    <span className="confidence-badge">
                      {recommendation.confidence}% confidence
                    </span>
                  </div>
                </div>
                <div className="confidence-circle">
                  <svg viewBox="0 0 36 36" className="confidence-chart">
                    <path
                      className="confidence-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="confidence-progress"
                      strokeDasharray={`${recommendation.confidence}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="confidence-text">{recommendation.confidence}%</div>
                </div>
              </div>
              
              <p className="recommendation-description">{recommendation.description}</p>
              
              <div className="recommendation-actions">
                <h5>Action Items:</h5>
                <ul className="actions-list">
                  {recommendation.actions.map((action, index) => (
                    <li key={index}>
                      <span className="action-number">{index + 1}</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment Section */}
      <div className="risk-section">
        <h3 className="subsection-title">Risk Assessment</h3>
        <div className="risk-assessment">
          <div className="risk-overview">
            <div className="risk-level-indicator">
              <div className="risk-circle">
                <div 
                  className={`risk-level risk-${decisionData.riskAssessment.overall}`}
                  style={{ backgroundColor: getRiskLevelColor(decisionData.riskAssessment.overall) }}
                >
                  {decisionData.riskAssessment.overall.toUpperCase()}
                </div>
              </div>
              <h4>Overall Risk Level</h4>
            </div>
            
            <div className="risk-summary">
              <p>Based on comprehensive analysis of {decisionData.riskAssessment.factors.length} risk factors, 
              the overall risk level for this decision is classified as <strong>{decisionData.riskAssessment.overall}</strong>.</p>
            </div>
          </div>
          
          <div className="risk-factors">
            <h4>Risk Factors Analysis</h4>
            <div className="factors-grid">
              {decisionData.riskAssessment.factors.map((factor, index) => (
                <div key={index} className="risk-factor-card">
                  <div className="factor-header">
                    <h5 className="factor-name">{factor.name}</h5>
                    <span 
                      className="factor-level"
                      style={{ backgroundColor: getRiskLevelColor(factor.level) }}
                    >
                      {factor.level}
                    </span>
                  </div>
                  <p className="factor-description">{factor.description}</p>
                  <div className="factor-indicator">
                    <div 
                      className="indicator-bar"
                      style={{ 
                        width: factor.level === 'high' ? '100%' : factor.level === 'medium' ? '60%' : '30%',
                        backgroundColor: getRiskLevelColor(factor.level)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Center */}
      <div className="action-center">
        <h3 className="subsection-title">Decision Action Center</h3>
        <div className="action-buttons">
          <button className="action-btn primary">
            <span className="action-icon">📋</span>
            Generate Full Report
          </button>
          <button className="action-btn secondary">
            <span className="action-icon">📊</span>
            Export Analysis
          </button>
          <button className="action-btn secondary">
            <span className="action-icon">🔄</span>
            Refresh Analysis
          </button>
          <button className="action-btn secondary">
            <span className="action-icon">⚙️</span>
            Configure Parameters
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecisionMaker;
