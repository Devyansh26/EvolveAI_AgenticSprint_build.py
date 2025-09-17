import { useState, useEffect } from 'react';
import type { DashboardData, Widget } from '../types';
import { apiService } from '../services/api';
import './Dashboard.css';

interface DashboardProps {
  datasetId: string;
}

const Dashboard = ({ datasetId }: DashboardProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, [datasetId]);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    const response = await apiService.getDashboard(datasetId);
    if (response.success && response.data) {
      setDashboardData(response.data);
    } else {
      setError(response.error || 'Failed to load dashboard data');
    }
    setLoading(false);
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'metric':
        return <MetricWidget widget={widget} />;
      case 'chart':
        return <ChartWidget widget={widget} />;
      case 'table':
        return <TableWidget widget={widget} />;
      default:
        return <DefaultWidget widget={widget} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendClass = (trend: string) => {
    switch (trend) {
      case 'up': return 'positive';
      case 'down': return 'negative';
      default: return 'neutral';
    }
  };

  if (loading) {
    return (
      <div className="section-container">
        <div className="loading-state">
          <div className="loading-spinner pulse"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="section-container">
        <div className="error-state">
          <h3>Failed to Load Dashboard</h3>
          <p>{error}</p>
          <button className="btn" onClick={loadDashboard}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">Dashboard</h2>
        <p className="section-subtitle">
          Real-time metrics and key performance indicators for {datasetId} dataset
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="metrics-section">
        <h3 className="subsection-title">Key Metrics</h3>
        <div className="metrics-row">
          {dashboardData.metrics.map((metric) => (
            <div key={metric.id} className="metric-card">
              <div className="metric-header">
                <span className="metric-trend-icon">
                  {getTrendIcon(metric.trend)}
                </span>
                <span className="metric-label">{metric.name}</span>
              </div>
              <div className="metric-value">{metric.value}</div>
              {metric.change !== undefined && (
                <div className={`metric-change ${getTrendClass(metric.trend)}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Widgets Section */}
      <div className="widgets-section">
        <h3 className="subsection-title">Widgets</h3>
        <div className="dashboard-grid">
          {dashboardData.widgets.map((widget) => (
            <div key={widget.id} className="widget-wrapper">
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <h3 className="subsection-title">Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-content">
              <h4>Generate Report</h4>
              <p>Create comprehensive data report</p>
            </div>
          </button>
          
          <button className="action-card">
            <div className="action-icon">📤</div>
            <div className="action-content">
              <h4>Export Data</h4>
              <p>Download dataset in various formats</p>
            </div>
          </button>
          
          <button className="action-card">
            <div className="action-icon">🔄</div>
            <div className="action-content">
              <h4>Refresh Data</h4>
              <p>Update with latest information</p>
            </div>
          </button>
          
          <button className="action-card">
            <div className="action-icon">⚙️</div>
            <div className="action-content">
              <h4>Configure</h4>
              <p>Customize dashboard settings</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Widget components
const MetricWidget = ({ widget }: { widget: Widget }) => (
  <div className="widget-card metric-widget">
    <div className="widget-header">
      <h4 className="widget-title">{widget.title}</h4>
    </div>
    <div className="widget-content">
      <div className="large-metric-value">{widget.data.value}</div>
      {widget.data.change !== undefined && (
        <div className={`large-metric-change ${widget.data.trend === 'up' ? 'positive' : widget.data.trend === 'down' ? 'negative' : 'neutral'}`}>
          {widget.data.change > 0 ? '+' : ''}{widget.data.change}%
          <span className="trend-indicator">
            {widget.data.trend === 'up' ? '↗️' : widget.data.trend === 'down' ? '↘️' : '➡️'}
          </span>
        </div>
      )}
    </div>
  </div>
);

const ChartWidget = ({ widget }: { widget: Widget }) => (
  <div className="widget-card chart-widget">
    <div className="widget-header">
      <h4 className="widget-title">{widget.title}</h4>
    </div>
    <div className="widget-content">
      <div className="chart-visualization">
        {widget.data.type === 'line' ? (
          <div className="line-chart-widget">
            <div className="chart-line">
              <div className="line-path-widget"></div>
              <div className="data-points">
                {Array.from({ length: 6 }, (_, i) => (
                  <div 
                    key={i} 
                    className="data-point" 
                    style={{ 
                      left: `${i * 20}%`,
                      top: `${Math.random() * 50 + 25}%`
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="chart-labels">
              <span>Past</span>
              <span>Present</span>
            </div>
          </div>
        ) : (
          <div className="default-chart-widget">
            <div className="chart-bars">
              {Array.from({ length: 5 }, (_, i) => (
                <div 
                  key={i} 
                  className="chart-bar" 
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const TableWidget = ({ widget }: { widget: Widget }) => (
  <div className="widget-card table-widget">
    <div className="widget-header">
      <h4 className="widget-title">{widget.title}</h4>
    </div>
    <div className="widget-content">
      <div className="table-placeholder">
        <div className="table-header">
          <div className="table-cell">Item</div>
          <div className="table-cell">Value</div>
          <div className="table-cell">Status</div>
        </div>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="table-row">
            <div className="table-cell">Item {i + 1}</div>
            <div className="table-cell">{Math.floor(Math.random() * 1000)}</div>
            <div className="table-cell">
              <span className={`status-badge ${i % 2 === 0 ? 'active' : 'inactive'}`}>
                {i % 2 === 0 ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DefaultWidget = ({ widget }: { widget: Widget }) => (
  <div className="widget-card default-widget">
    <div className="widget-header">
      <h4 className="widget-title">{widget.title}</h4>
    </div>
    <div className="widget-content">
      <div className="default-content">
        <div className="content-icon">📊</div>
        <p>Widget content will be displayed here</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
