# Evolve Analytics Frontend

A futuristic dark-themed React + Vite application for data analytics with AI-powered insights.

## Features

- 🎨 **Futuristic Dark Theme** - Modern, minimal UI with cyan accents
- 📊 **Analytics Dashboard** - Comprehensive data visualization and insights
- 📈 **Interactive Dashboard** - Real-time metrics and KPIs
- 💬 **AI Chat Interface** - Conversational data analysis
- 🎯 **Decision Maker** - AI-powered strategic recommendations
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔄 **Mock API Integration** - Ready for backend connection

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd evolve-frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Analytics.tsx   # Data analytics component
│   ├── Dashboard.tsx   # Metrics dashboard
│   ├── Chat.tsx        # AI chat interface
│   ├── DecisionMaker.tsx # Strategic recommendations
│   └── Navigation.tsx  # Sidebar navigation
├── pages/              # Main application pages
│   ├── LandingPage.tsx # Dataset selection page
│   └── DatasetPage.tsx # Main dataset analysis page
├── services/           # API integration layer
│   └── api.ts          # API service with mock data
├── types/              # TypeScript type definitions
│   └── index.ts        # All application types
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## Backend Integration

### API Endpoints Required

The frontend expects the following REST API endpoints:

#### 1. Datasets
```
GET /api/datasets
- Returns: List of available datasets
- Response: { success: boolean, data: Dataset[] }

GET /api/datasets/:id
- Returns: Specific dataset details
- Response: { success: boolean, data: Dataset }

POST /api/datasets/upload
- Body: FormData with file and metadata
- Returns: Uploaded dataset info
- Response: { success: boolean, data: Dataset }
```

#### 2. Analytics
```
GET /api/datasets/:id/analytics
- Returns: Analytics data for dataset
- Response: { success: boolean, data: AnalyticsData }
```

#### 3. Dashboard
```
GET /api/datasets/:id/dashboard
- Returns: Dashboard metrics and widgets
- Response: { success: boolean, data: DashboardData }
```

#### 4. Chat
```
POST /api/datasets/:id/chat
- Body: { message: string, conversationId?: string }
- Returns: AI chat response
- Response: { success: boolean, data: ChatResponse }
```

#### 5. Decision Analysis
```
GET /api/datasets/:id/decisions
- Returns: Decision analysis data
- Response: { success: boolean, data: DecisionData }
```

### Environment Configuration

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Set your backend URL:**
   ```
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

### Replacing Mock Data

To connect to your backend:

1. **Update API service** (`src/services/api.ts`):
   - Uncomment actual API calls
   - Comment out mock data returns
   - Test each endpoint individually

2. **Error handling** is already implemented:
   - Network errors
   - API response errors
   - Loading states

### Backend Requirements

- **CORS enabled** for frontend domain
- **JSON responses** in specified format
- **Error handling** with appropriate HTTP status codes
- **File upload support** for custom datasets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **CSS Variables** - Theme system

## Features Overview

### Landing Page
- Dataset selection interface
- Zomato and Paytm datasets (mock)
- Custom dataset upload functionality
- Futuristic glassmorphism design

### Analytics Page
- Data overview with key metrics
- Interactive charts (bar, pie, line)
- Automated insights generation
- Responsive grid layout

### Dashboard Page
- Real-time KPI monitoring
- Customizable widgets
- Trend indicators
- Quick action buttons

### Chat Interface
- AI-powered data conversations
- Message history
- Typing indicators
- Suggestion chips

### Decision Maker
- Scenario analysis
- Strategic recommendations
- Risk assessment
- Confidence scoring

## Customization

### Theme Colors
Update CSS variables in `src/index.css`:
```css
:root {
  --accent-primary: #00ffff;    /* Cyan */
  --accent-secondary: #ff00ff;  /* Magenta */
  --accent-tertiary: #ffff00;   /* Yellow */
}
```

### Adding New Components
1. Create component in `src/components/`
2. Add corresponding CSS file
3. Export from component file
4. Import and use in pages

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - see LICENSE file for details

---

**Note:** This frontend includes comprehensive mock data and is ready for backend integration. Follow the backend integration guide above to connect to your API endpoints.