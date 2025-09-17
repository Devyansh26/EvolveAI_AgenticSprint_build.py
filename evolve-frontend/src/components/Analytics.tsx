import { useState, useEffect } from 'react';
import type { AnalyticsData, ChartData } from '../types';
import { apiService } from '../services/api';
import './Analytics.css';

interface AnalyticsProps {
  datasetId: string;
}

const Analytics = ({ datasetId }: AnalyticsProps) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [datasetId]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    const response = await apiService.getAnalytics(datasetId);
    if (response.success && response.data) {
      setAnalyticsData(response.data);
    } else {
      setError(response.error || 'Failed to load analytics data');
    }
    setLoading(false);
  };

  const renderChart = (chart: ChartData) => {
    switch (chart.type) {
      case 'bar':
        return <BarChart data={chart.data} title={chart.title} />;
      case 'pie':
        return <PieChart data={chart.data} title={chart.title} />;
      case 'line':
        return <LineChart data={chart.data} title={chart.title} />;
      default:
        return <SimpleChart data={chart.data} title={chart.title} />;
    }
  };

  if (loading) {
    return (
      <div className="section-container">
        <div className="loading-state">
          <div className="loading-spinner pulse"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="section-container">
        <div className="error-state">
          <h3>Failed to Load Analytics</h3>
          <p>{error}</p>
          <button className="btn" onClick={loadAnalytics}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">Analytics Overview</h2>
        <p className="section-subtitle">
          Comprehensive data analysis and insights for {datasetId} dataset
        </p>
      </div>

      {/* Overview Section */}
      <div className="analytics-overview">
        <div className="overview-grid">
          <div className="overview-card">
            <div className="overview-icon">📊</div>
            <div className="overview-content">
              <h3>Total Records</h3>
              <p className="overview-value">{analyticsData.overview.totalRecords.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">📁</div>
            <div className="overview-content">
              <h3>Data Types</h3>
              <p className="overview-value">{analyticsData.overview.dataTypes.length}</p>
              <small>{analyticsData.overview.dataTypes.join(', ')}</small>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">💾</div>
            <div className="overview-content">
              <h3>Dataset Size</h3>
              <p className="overview-value">{analyticsData.overview.size}</p>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">🕐</div>
            <div className="overview-content">
              <h3>Last Updated</h3>
              <p className="overview-value">{analyticsData.overview.lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <h3 className="subsection-title">Data Visualizations</h3>
        <div className="charts-grid">
          {analyticsData.charts.map((chart) => (
            <div key={chart.id} className="chart-card">
              {renderChart(chart)}
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3 className="subsection-title">Key Insights</h3>
        <div className="insights-grid">
          {analyticsData.insights.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-icon">💡</div>
              <p className="insight-text">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple chart components (placeholder implementations)
const BarChart = ({ data, title }: { data: any[], title: string }) => (
  <div className="chart-content">
    <h4 className="chart-title">{title}</h4>
    <div className="chart-placeholder bar-chart">
      {data.map((item, index) => (
        <div key={index} className="bar-item">
          <div className="bar-label">{item.city || item.name || `Item ${index + 1}`}</div>
          <div className="bar-container">
            <div 
              className="bar-fill" 
              style={{ 
                width: `${Math.min((item.count || item.value || 0) / Math.max(...data.map(d => d.count || d.value || 0)) * 100, 100)}%` 
              }}
            ></div>
          </div>
          <div className="bar-value">{item.count || item.value || 0}</div>
        </div>
      ))}
    </div>
  </div>
);

const PieChart = ({ data, title }: { data: any[], title: string }) => (
  <div className="chart-content">
    <h4 className="chart-title">{title}</h4>
    <div className="chart-placeholder pie-chart">
      <div className="pie-container">
        <div className="pie-visual">
          <div className="pie-slice"></div>
        </div>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div className={`legend-color color-${index % 4}`}></div>
              <span className="legend-label">{item.cuisine || item.name || `Item ${index + 1}`}</span>
              <span className="legend-value">{item.percentage || item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const LineChart = ({ title }: { data: any[], title: string }) => (
  <div className="chart-content">
    <h4 className="chart-title">{title}</h4>
    <div className="chart-placeholder line-chart">
      <div className="line-visual">
        <div className="line-path"></div>
        <div className="line-points">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="line-point" style={{ left: `${i * 14}%` }}></div>
          ))}
        </div>
      </div>
      <div className="line-labels">
        <span>Start</span>
        <span>End</span>
      </div>
    </div>
  </div>
);

const SimpleChart = ({ data, title }: { data: any[], title: string }) => (
  <div className="chart-content">
    <h4 className="chart-title">{title}</h4>
    <div className="chart-placeholder simple-chart">
      <div className="simple-visual">
        <div className="simple-bars">
          {data.slice(0, 5).map((_, index) => (
            <div 
              key={index} 
              className="simple-bar" 
              style={{ height: `${Math.random() * 80 + 20}%` }}
            ></div>
          ))}
        </div>
      </div>
      <p className="chart-description">
        Data visualization for {title.toLowerCase()}
      </p>
    </div>
  </div>
);

export default Analytics;
