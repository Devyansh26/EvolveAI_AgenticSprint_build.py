import { useNavigate } from 'react-router-dom';
import { WavyBackground } from '../components/ui/wavy-background';
import ColourfulText from '../components/ui/colourful-text';
import { SimpleNavbar } from '../components/ui/simple-navbar';
import { IconBrain, IconRocket, IconShield, IconTrendingUp, IconUsers, IconAward } from '@tabler/icons-react';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/datasets');
  };


  const features = [
    {
      icon: <IconBrain className="h-8 w-8 text-cyan-400" />,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze your data to uncover hidden patterns and insights."
    },
    {
      icon: <IconRocket className="h-8 w-8 text-purple-400" />,
      title: "Lightning Fast Processing",
      description: "Process massive datasets in seconds with our optimized infrastructure and parallel computing."
    },
    {
      icon: <IconShield className="h-8 w-8 text-green-400" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with industry standards to keep your data secure."
    },
    {
      icon: <IconTrendingUp className="h-8 w-8 text-yellow-400" />,
      title: "Real-time Insights",
      description: "Get instant updates and live dashboards that adapt to your data changes in real-time."
    },
    {
      icon: <IconUsers className="h-8 w-8 text-pink-400" />,
      title: "Collaborative Workspace",
      description: "Share insights with your team and collaborate on data analysis projects seamlessly."
    },
    {
      icon: <IconAward className="h-8 w-8 text-blue-400" />,
      title: "Award-Winning Platform",
      description: "Recognized by industry leaders for innovation in data analytics and visualization."
    }
  ];

  const stats = [
    { number: "10M+", label: "Data Points Processed" },
    { number: "500+", label: "Enterprise Clients" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "50+", label: "Data Sources Supported" }
  ];


  return (
    <div className="relative">
      <SimpleNavbar />
      
      {/* Hero Section with Wavy Background */}
      <WavyBackground
        colors={['#00ffff', '#ff00ff', '#ffff00', '#00ff88', '#ff4444']}
        waveWidth={50}
        backgroundFill="var(--bg-primary)"
        blur={15}
        speed="slow"
        waveOpacity={0.3}
        className="homepage-container"
        id="home"
      >
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="hero-text-gradient">CFOx.ai</span>
          </h1>
          <p className="hero-subtitle">
            Leverage the power of AI to create beautiful data insights
          </p>
          <div className="hero-actions">
            <button 
              className="hero-btn primary"
              onClick={handleGetStarted}
            >
              <span className="btn-text">Get Started</span>
              <span className="btn-icon">→</span>
            </button>
            <button className="hero-btn secondary">
              <span className="btn-text">Learn More</span>
            </button>
          </div>
        </div>
      </WavyBackground>

      {/* Stats Section */}
      <section id="how-it-works" className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="features-section">
        <div className="features-container">
          <div className="section-header">
                <h2 className="section-title">
                  Why Choose <ColourfulText text="CFOx.ai" />?
            </h2>
            <p className="section-subtitle">
              Transform your data into actionable insights with our cutting-edge analytics platform
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to Transform Your <ColourfulText text="Data" />?
          </h2>
          <p className="cta-subtitle">
                Join thousands of companies already using CFOx.ai to make data-driven decisions
          </p>
          <div className="cta-actions">
            <button 
              className="cta-btn primary"
              onClick={handleGetStarted}
            >
              <span className="btn-text">Start Free Trial</span>
              <span className="btn-icon">→</span>
            </button>
            <button className="cta-btn secondary">
              <span className="btn-text">Schedule Demo</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
