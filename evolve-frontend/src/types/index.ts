// Dataset types
export interface Dataset {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  lastUpdated?: string;
  recordCount?: number;
}

// Analytics data types
export interface AnalyticsData {
  overview: {
    totalRecords: number;
    dataTypes: string[];
    lastUpdated: string;
    size: string;
  };
  charts: ChartData[];
  insights: string[];
}

export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter';
  title: string;
  data: any[];
  xAxis?: string;
  yAxis?: string;
}

// Dashboard data types
export interface DashboardData {
  widgets: Widget[];
  metrics: Metric[];
}

export interface Widget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'text';
  title: string;
  data: any;
  config?: any;
}

export interface Metric {
  id: string;
  name: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
}

// Chat types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'chart' | 'table';
  data?: any;
}

export interface ChatResponse {
  message: string;
  type: 'text' | 'chart' | 'table';
  data?: any;
}

// Decision maker types
export interface DecisionData {
  scenarios: Scenario[];
  recommendations: Recommendation[];
  riskAssessment: RiskAssessment;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  outcomes: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  actions: string[];
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  level: 'low' | 'medium' | 'high';
  description: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Navigation types
export type PageSection = 'analytics' | 'dashboard' | 'chat' | 'decision-maker';

export interface NavigationItem {
  id: PageSection;
  label: string;
  icon?: string;
}
