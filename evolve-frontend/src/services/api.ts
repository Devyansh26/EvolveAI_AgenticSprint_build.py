import type { 
  Dataset, 
  AnalyticsData, 
  DashboardData, 
  ChatResponse, 
  DecisionData,
  ApiResponse 
} from '../types';

// Base API configuration
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private readonly CHAT_BASE_URL = 'https://86p6qcml-5000.inc1.devtunnels.ms';

  async queryBackend(query: string): Promise<ApiResponse<any>> {
    try {
      const modifiedQuery = query.includes("in the context of Zomato")
      ? query
      : `${query} in the context of Zomato`;
      const res = await fetch(`${this.CHAT_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: modifiedQuery })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data?.message || 'Chat request failed' };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
  }
  // TODO: Uncomment when connecting to backend
  // private async request<T>(
  //   endpoint: string, 
  //   options: RequestInit = {}
  // ): Promise<ApiResponse<T>> {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         ...options.headers,
  //       },
  //       ...options,
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       return {
  //         success: false,
  //         error: data.message || 'API request failed',
  //       };
  //     }

  //     return {
  //       success: true,
  //       data,
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: error instanceof Error ? error.message : 'Unknown error occurred',
  //     };
  //   }
  // }

  // Dataset endpoints
  async getDatasets(): Promise<ApiResponse<Dataset[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return this.request<Dataset[]>('/datasets');
    
    // Mock data for development
    return {
      success: true,
      data: [
        {
          id: 'zomato',
          name: 'zomato',
          displayName: 'Zomato',
          description: 'Restaurant and food delivery data',
          recordCount: 15420,
          lastUpdated: '2024-01-15',
        },
        {
          id: 'paytm',
          name: 'paytm',
          displayName: 'Paytm',
          description: 'Digital payment and transaction data',
          recordCount: 89530,
          lastUpdated: '2024-01-14',
        },
      ],
    };
  }

  async getDataset(datasetId: string): Promise<ApiResponse<Dataset>> {
    // TODO: Replace with actual API call when backend is ready
    // return this.request<Dataset>(`/datasets/${datasetId}`);
    
    const datasets = await this.getDatasets();
    const dataset = datasets.data?.find(d => d.id === datasetId);
    
    if (dataset) {
      return { success: true, data: dataset };
    } else {
      return { success: false, error: 'Dataset not found' };
    }
  }

  // Analytics endpoints
  async getAnalytics(_datasetId: string): Promise<ApiResponse<AnalyticsData>> {
    // TODO: Replace with actual API call when backend is ready
    // return this.request<AnalyticsData>(`/datasets/${datasetId}/analytics`);
    
    return {
      success: true,
      data: {
        overview: {
          totalRecords: 15420,
          dataTypes: ['restaurants', 'reviews', 'ratings', 'locations'],
          lastUpdated: '2024-01-15',
          size: '2.3 GB',
        },
        charts: [
          {
            id: '1',
            type: 'bar',
            title: 'Restaurants by City',
            data: [
              { city: 'Mumbai', count: 3200 },
              { city: 'Delhi', count: 2800 },
              { city: 'Bangalore', count: 2100 },
              { city: 'Chennai', count: 1800 },
            ],
          },
          {
            id: '2',
            type: 'pie',
            title: 'Cuisine Distribution',
            data: [
              { cuisine: 'Indian', percentage: 35 },
              { cuisine: 'Chinese', percentage: 20 },
              { cuisine: 'Italian', percentage: 15 },
              { cuisine: 'Others', percentage: 30 },
            ],
          },
        ],
        insights: [
          'Peak ordering hours are between 7-9 PM',
          'Indian cuisine dominates with 35% market share',
          'Mumbai has the highest restaurant density',
          'Average rating across platform is 4.2/5',
        ],
      },
    };
  }

  // Dashboard endpoints
  async getDashboard(_datasetId: string): Promise<ApiResponse<DashboardData>> {
    // TODO: Replace with actual API call when backend is ready
    // return this.request<DashboardData>(`/datasets/${datasetId}/dashboard`);
    
    return {
      success: true,
      data: {
        widgets: [
          {
            id: '1',
            type: 'metric',
            title: 'Total Orders',
            data: { value: '1.2M', change: 12.5, trend: 'up' },
          },
          {
            id: '2',
            type: 'metric',
            title: 'Revenue',
            data: { value: '₹24.8Cr', change: 8.3, trend: 'up' },
          },
          {
            id: '3',
            type: 'chart',
            title: 'Daily Orders Trend',
            data: {
              type: 'line',
              data: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                orders: Math.floor(Math.random() * 1000) + 500,
              })),
            },
          },
        ],
        metrics: [
          { id: '1', name: 'Active Restaurants', value: '12,450', change: 5.2, trend: 'up' },
          { id: '2', name: 'Avg Delivery Time', value: '28 min', change: -3.1, trend: 'down' },
          { id: '3', name: 'Customer Satisfaction', value: '4.2/5', change: 0.1, trend: 'up' },
          { id: '4', name: 'Order Cancellation Rate', value: '8.5%', change: -1.2, trend: 'down' },
        ],
      },
    };
  }

  // Chat endpoints
  async sendChatMessage(
    datasetId: string, 
    message: string, 
    _conversationId?: string
  ): Promise<ApiResponse<ChatResponse>> {
    // TODO: Replace with actual API call when backend is ready
    // return this.request<ChatResponse>(`/datasets/${datasetId}/chat`, {
    //   method: 'POST',
    //   body: JSON.stringify({ message, conversationId }),
    // });
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        message: `Based on the ${datasetId} dataset analysis: ${this.generateMockResponse(message)}`,
        type: 'text',
      },
    };
  }

  private generateMockResponse(_userMessage: string): string {
    const responses = [
      "The data shows interesting patterns in user behavior during peak hours.",
      "Revenue trends indicate a 15% growth compared to last quarter.",
      "Customer satisfaction metrics are above industry average.",
      "There's a strong correlation between delivery time and customer ratings.",
      "Peak demand occurs during weekend evenings and lunch hours.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Decision maker endpoints
  async getDecisionData(_datasetId: string): Promise<ApiResponse<DecisionData>> {
    // TODO: Replace with actual API call when backend is ready
    // return this.request<DecisionData>(`/datasets/${datasetId}/decisions`);
    
    return {
      success: true,
      data: {
        scenarios: [
          {
            id: '1',
            name: 'Market Expansion',
            description: 'Expand to 5 new cities within 6 months',
            probability: 75,
            impact: 'high',
            outcomes: [
              'Increase market share by 25%',
              'Additional revenue of ₹50Cr annually',
              'Higher operational costs initially',
            ],
          },
          {
            id: '2',
            name: 'Premium Service Launch',
            description: 'Launch premium delivery service with guaranteed 15-min delivery',
            probability: 60,
            impact: 'medium',
            outcomes: [
              'Higher customer satisfaction',
              'Premium pricing opportunities',
              'Increased delivery costs',
            ],
          },
        ],
        recommendations: [
          {
            id: '1',
            title: 'Optimize Delivery Routes',
            description: 'Implement AI-powered route optimization to reduce delivery times',
            confidence: 85,
            priority: 'high',
            actions: [
              'Deploy route optimization algorithm',
              'Train delivery partners',
              'Monitor performance metrics',
            ],
          },
          {
            id: '2',
            title: 'Dynamic Pricing Strategy',
            description: 'Implement dynamic pricing based on demand and supply',
            confidence: 70,
            priority: 'medium',
            actions: [
              'Analyze pricing elasticity',
              'A/B test pricing models',
              'Implement gradual rollout',
            ],
          },
        ],
        riskAssessment: {
          overall: 'medium',
          factors: [
            {
              name: 'Market Competition',
              level: 'high',
              description: 'Intense competition from established players',
            },
            {
              name: 'Regulatory Changes',
              level: 'medium',
              description: 'Potential changes in food delivery regulations',
            },
            {
              name: 'Supply Chain Disruption',
              level: 'low',
              description: 'Minimal risk of major supply chain issues',
            },
          ],
        },
      },
    };
  }

  // Custom dataset upload (for "Add Yours" functionality)
  async uploadDataset(file: File, metadata: any): Promise<ApiResponse<Dataset>> {
    // TODO: Replace with actual API call when backend is ready
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('metadata', JSON.stringify(metadata));
    // 
    // return this.request<Dataset>('/datasets/upload', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {}, // Remove Content-Type to let browser set it for FormData
    // });
    
    return {
      success: true,
      data: {
        id: 'custom-' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        displayName: metadata.displayName || file.name,
        description: metadata.description || 'Custom uploaded dataset',
        recordCount: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    };
  }
}

export const apiService = new ApiService();

// TODO: Backend Integration Guide
/*
BACKEND INTEGRATION INSTRUCTIONS:

1. Environment Variables:
   - Create a .env file in the root directory
   - Add: VITE_API_BASE_URL=your_backend_url
   - Example: VITE_API_BASE_URL=http://localhost:3001/api

2. API Endpoints to implement in your backend:

   GET /api/datasets
   - Returns array of available datasets
   - Response format: { success: boolean, data: Dataset[] }

   GET /api/datasets/:id
   - Returns specific dataset details
   - Response format: { success: boolean, data: Dataset }

   GET /api/datasets/:id/analytics
   - Returns analytics data for dataset
   - Response format: { success: boolean, data: AnalyticsData }

   GET /api/datasets/:id/dashboard
   - Returns dashboard data for dataset
   - Response format: { success: boolean, data: DashboardData }

   POST /api/datasets/:id/chat
   - Body: { message: string, conversationId?: string }
   - Returns AI chat response
   - Response format: { success: boolean, data: ChatResponse }

   GET /api/datasets/:id/decisions
   - Returns decision making data
   - Response format: { success: boolean, data: DecisionData }

   POST /api/datasets/upload
   - FormData with file and metadata
   - Returns uploaded dataset info
   - Response format: { success: boolean, data: Dataset }

3. Error Handling:
   - All endpoints should return consistent error format
   - HTTP status codes should match success/error state
   - Error response: { success: false, error: string, message?: string }

4. Authentication (if needed):
   - Add Authorization header to request method
   - Implement token-based authentication

5. CORS:
   - Ensure backend allows requests from frontend domain
   - Set appropriate CORS headers

6. Replace mock data:
   - Comment out mock data returns
   - Uncomment actual API calls
   - Test each endpoint individually
*/
