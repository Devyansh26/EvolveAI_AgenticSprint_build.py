import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import DatasetPage from './pages/DatasetPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/datasets" element={<LandingPage />} />
          <Route path="/dataset/:datasetName" element={<DatasetPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;