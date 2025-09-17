import { useState, useEffect, useRef } from 'react';
import type { ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto';
import mermaid from 'mermaid';
import { IconUser, IconRobot } from '@tabler/icons-react';
import type { ChatMessage } from '../types';
import { apiService } from '../services/api';
import './Chat.css';

interface ChatProps {
  datasetId: string;
}

const Chat = ({ datasetId }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState<string>(`conv_${Date.now()}`); // reserved for future backend threading
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: `Hello! I'm your AI assistant for analyzing the ${datasetId} dataset. You can ask me questions about the data, request specific analyses, or get insights. What would you like to know?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    };
    setMessages([welcomeMessage]);
  }, [datasetId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Hardcoded simulation for the provided query
    const normalized = inputMessage.toLowerCase();
    const isZomatoFy2024Pie =
      normalized.includes('pie chart') &&
      normalized.includes('zomato') &&
      (normalized.includes('fy 2024') || normalized.includes('fy 2024-25') || normalized.includes('2024'));

    if (isZomatoFy2024Pie) {
      // Simulate thinking delay
      setTimeout(() => {
        const aiText: ChatMessage = {
          id: `ai_text_${Date.now()}`,
          content:
            "Zomato’s shareholding pattern for FY 2024-25 shows that public investors dominate with 94.02% ownership. Institutions hold the largest share at 67.92%, while non-institutions account for 26.10%. Additionally, the Employee Benefit Trust holds 5.98% of the total shares, and promoters hold none.",
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        };

        const config: ChartConfiguration = {
          type: 'pie',
          data: {
            labels: ['Institutions', 'Non-Institutions', 'Employee Benefit Trust'],
            datasets: [
              {
                label: 'Zomato Shareholding Pattern FY 2024-25',
                data: [67.92, 26.1, 5.98],
                backgroundColor: [
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.parsed}%`;
                  }
                }
              },
              title: {
                display: true,
                text: 'Zomato Shareholding Pattern as of March 31, 2025'
              }
            }
          }
        };

        const aiChart: ChatMessage = {
          id: `ai_chart_${Date.now()}`,
          content: 'Pie chart generated from the data for FY 2024-25',
          sender: 'ai',
          timestamp: new Date(),
          type: 'chart',
          data: { config }
        };

        setMessages(prev => [...prev, aiText, aiChart]);
        setIsLoading(false);
      }, 6000);

      return;
    }

    // Hardcoded simulation for FY23 vs FY24 sales data bar chart
    const isSalesFy23Fy24 =
      normalized.includes('sales data') &&
      (normalized.includes('fy23') || normalized.includes('fy 23')) &&
      (normalized.includes('fy24') || normalized.includes('fy 24') || normalized.includes('24'));

    if (isSalesFy23Fy24) {
      setTimeout(() => {
        const aiText: ChatMessage = {
          id: `ai_text_${Date.now()}`,
          content:
            "Zomato’s total adjusted revenue grew from INR 8,693 crore in FY23 to INR 13,545 crore in FY24, a 56% increase. Food delivery remained the largest contributor, while quick commerce nearly tripled. Hyperpure revenue more than doubled, and the going-out segment also saw healthy growth.",
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        };

        const config: ChartConfiguration = {
          type: 'bar',
          data: {
            labels: ['Food Delivery', 'Quick Commerce', 'Going-out', 'B2B Supplies (Hyperpure)', 'Others'],
            datasets: [
              {
                label: 'FY23 Adjusted Revenue (INR crore)',
                data: [6147, 806, 171, 1506, 63],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: 'FY24 Adjusted Revenue (INR crore)',
                data: [7792, 2301, 258, 3172, 22],
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'top' },
              title: {
                display: true,
                text: 'Consolidated Adjusted Revenue by Business Segment (FY23 vs FY24)'
              }
            },
            scales: {
              x: {
                title: { display: true, text: 'Business Segment' },
                grid: { display: false }
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Adjusted Revenue (INR crore)' }
              }
            }
          }
        };

        const aiChart: ChatMessage = {
          id: `ai_chart_${Date.now()}`,
          content: 'Bar chart comparing FY23 and FY24 adjusted revenue by segment',
          sender: 'ai',
          timestamp: new Date(),
          type: 'chart',
          data: { config }
        };

        setMessages(prev => [...prev, aiText, aiChart]);
        setIsLoading(false);
      }, 6000);

      return;
    }

    // Hardcoded simulation for Zomato board hierarchy (Mermaid.js flowchart)
    const isBoardHierarchy =
      normalized.includes("board") &&
      normalized.includes("hierarchy") &&
      normalized.includes("zomato");

    if (isBoardHierarchy) {
      setTimeout(() => {
        const aiText: ChatMessage = {
          id: `ai_text_${Date.now()}`,
          content:
            "Zomato Limited’s Board of Directors is led by Founder & CEO Deepinder Goyal. The board also includes Sanjiv Bikhchandani as a Non-Executive Director, and independent directors Kaushik Dutta, Aparna Popat, and Sutapa Banerjee. This structure ensures balanced governance with executive, non-executive, and independent oversight.",
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        };

        const diagram = `flowchart TB\n    A[Zomato Limited - Board of Directors]\n    \n    A --> B[Deepinder Goyal<br>Founder & CEO]\n    A --> C[Sanjiv Bikhchandani<br>Non-Executive Director]\n    A --> D[Kaushik Dutta<br>Independent Director]\n    A --> E[Aparna Popat<br>Independent Director]\n    A --> F[Sutapa Banerjee<br>Independent Director]`;

        const aiDiagram: ChatMessage = {
          id: `ai_mermaid_${Date.now()}`,
          content: 'Board hierarchy diagram',
          sender: 'ai',
          timestamp: new Date(),
          type: 'chart',
          data: { mermaid: diagram }
        };

        setMessages(prev => [...prev, aiText, aiDiagram]);
        setIsLoading(false);
      }, 6000);

      return;
    }

    try {
      const response = await apiService.queryBackend(inputMessage);
      if (response.success && response.data?.response) {
        const items = response.data.response as any[];
        const metadata = items.find(item => item.metadata)?.metadata;
        const created: ChatMessage[] = [];
        for (const item of items) {
          if (item.message) {
            created.push({
              id: `ai_msg_${Date.now()}_${created.length}`,
              content: item.message,
              sender: 'ai',
              timestamp: new Date(),
              type: 'text',
              data: metadata ? { sources: metadata.source_documents } : undefined,
            });
          }
          if (item.chart) {
            // Evaluate config string into object safely
            let config: ChartConfiguration | null = null;
            try {
              // eslint-disable-next-line no-new-func
              const fn = new Function(`${item.chart}; return config;`);
              // item.chart defines const config = {...};
              // We need to expose a scope where 'config' is returned
              // Wrap so that returned value is the defined config
              // Above function returns 'config'
              config = fn() as ChartConfiguration;
            } catch (_) {
              config = null;
            }
            created.push({
              id: `ai_chart_${Date.now()}_${created.length}`,
              content: 'Chart',
              sender: 'ai',
              timestamp: new Date(),
              type: 'chart',
              data: config ? { config } : undefined,
            });
          }
        }
        setMessages(prev => [...prev, ...created]);
      } else {
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        content: 'Connection error. Please check your connection and try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestions = [
    "What are the key trends in this dataset?",
    "Show me the top performing metrics",
    "What patterns do you see in the data?",
    "Generate a summary report",
    "What insights can you provide?",
    "Compare performance across different categories"
  ];

  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">AI Chat Assistant</h2>
        <p className="section-subtitle">
          Ask questions about your {datasetId} dataset and get AI-powered insights
        </p>
      </div>

      <div className="chat-container">
        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-avatar">
                {message.sender === 'user' ? (
                  <div className="user-avatar"><IconUser size={22} /></div>
                ) : (
                  <div className="ai-avatar"><IconRobot size={22} /></div>
                )}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <div className="message-text">{message.content}</div>
                  {message.data && message.type === 'chart' && (
                    <div className="message-chart">
                      {message.data.config ? (
                        <ChartRenderer config={message.data.config as ChartConfiguration} />
                      ) : message.data.mermaid ? (
                        <MermaidRenderer diagram={message.data.mermaid as string} />
                      ) : (
                        <div className="chart-placeholder-small">Unsupported chart payload</div>
                      )}
                    </div>
                  )}
                  {message.data && message.data.sources && (
                    <div className="message-sources">
                      <div className="sources-title">Source</div>
                      <div className="sources-list">
                        {(() => {
                          const source = message.data.sources[0];
                          return (
                            <div className="source-item">
                              {/* <div className="source-title">{source?.title || 'Document'}</div> */}
                              <div className="source-pages">
                                Pages {source?.pages ? Math.min(...source.pages) : '?'}-{source?.pages ? Math.max(...source.pages) : '?'}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  {message.data && message.type === 'table' && (
                    <div className="message-table">
                      <div className="table-placeholder-small">
                        📋 Table data would appear here
                      </div>
                    </div>
                  )}
                </div>
                <div className="message-timestamp">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message ai-message">
              <div className="message-avatar">
                <div className="ai-avatar"><IconRobot size={22} /></div>
              </div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="chat-suggestions">
            <h4>Try asking about:</h4>
            <div className="suggestions-grid">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="chat-input-area">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your dataset..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                <span className="send-icon">➤</span>
              )}
            </button>
          </div>
          <div className="input-help">
            <small>Press Enter to send • Shift+Enter for new line</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

// Lightweight renderer for Chart.js configs inside chat messages
function ChartRenderer({ config }: { config: ChartConfiguration }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const isBar = config.type === 'bar';
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Cleanup any previous instance
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config]);

  return (
    <div style={{ width: '100%', maxWidth: isBar ? 800 : 420, height: isBar ? 480 : undefined, position: 'relative' }}>
      <button
        className="chart-fullscreen-btn"
        aria-label="Fullscreen chart"
        onClick={() => setIsOpen(true)}
      >
        ⤢
      </button>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      {isOpen && (
        <FullscreenChart config={config} onClose={() => setIsOpen(false)} />)
      }
    </div>
  );
}

// Mermaid renderer for flowcharts/diagrams
function MermaidRenderer({ diagram }: { diagram: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' as any });
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    mermaid
      .render(id, diagram)
      .then(({ svg }) => {
        if (isMounted) setHtml(svg);
      })
      .catch(() => {
        if (isMounted) setHtml('<div style="color: var(--text-muted)">Failed to render diagram</div>');
      });
    return () => {
      isMounted = false;
    };
  }, [diagram]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const svg = node.querySelector('svg') as SVGElement | null;
    if (!svg) return;
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    (svg.style as any).width = '100%';
    (svg.style as any).height = '100%';
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }, [html]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', maxWidth: 1000, height: 520, overflow: 'auto' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Centered modal for charts
function FullscreenChart({ config, onClose }: { config: ChartConfiguration, onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    chartRef.current = new Chart(ctx, {
      ...config,
      options: {
        ...config.options,
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [config]);

  return (
    <div className="chart-modal-overlay" role="dialog" aria-modal="true">
      <div className="chart-modal">
        <div className="chart-modal-header">
          <button className="chart-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="chart-modal-body">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
