import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './LogChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const LogChart = ({ logs, filters }) => {
  const chartData = useMemo(() => {
    const levelCounts = {
      error: 0,
      warn: 0,
      info: 0,
      debug: 0
    };

    logs.forEach(log => {
      const level = log.level?.toLowerCase();
      if (levelCounts.hasOwnProperty(level)) {
        levelCounts[level]++;
      }
    });

    return levelCounts;
  }, [logs]);

  const barData = {
    labels: ['Error', 'Warning', 'Info', 'Debug'],
    datasets: [
      {
        label: 'Log Count',
        data: [chartData.error, chartData.warn, chartData.info, chartData.debug],
        backgroundColor: [
          'rgba(220, 53, 69, 0.8)',
          'rgba(253, 126, 20, 0.8)',
          'rgba(13, 202, 240, 0.8)',
          'rgba(108, 117, 125, 0.8)',
        ],
        borderColor: [
          'rgba(220, 53, 69, 1)',
          'rgba(253, 126, 20, 1)',
          'rgba(13, 202, 240, 1)',
          'rgba(108, 117, 125, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: ['Error', 'Warning', 'Info', 'Debug'],
    datasets: [
      {
        data: [chartData.error, chartData.warn, chartData.info, chartData.debug],
        backgroundColor: [
          'rgba(220, 53, 69, 0.8)',
          'rgba(253, 126, 20, 0.8)',
          'rgba(13, 202, 240, 0.8)',
          'rgba(108, 117, 125, 0.8)',
        ],
        borderColor: [
          'rgba(220, 53, 69, 1)',
          'rgba(253, 126, 20, 1)',
          'rgba(13, 202, 240, 1)',
          'rgba(108, 117, 125, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Log Count by Level',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} logs`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6c757d',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#6c757d',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
          color: '#374151',
        },
      },
      title: {
        display: true,
        text: 'Log Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
  };

  const totalLogs = Object.values(chartData).reduce((a, b) => a + b, 0);
  const hasActiveFilters = Object.values(filters).some(filter => filter);

  return (
    <div className="log-chart">
      <div className="chart-header">
        <h2>Log Analytics</h2>
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-value">{totalLogs}</span>
            <span className="stat-label">Total Logs</span>
          </div>
          {hasActiveFilters && (
            <div className="stat-item">
              <span className="stat-indicator">🔍</span>
              <span className="stat-label">Filtered</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-section">
          <div className="chart-wrapper">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        
        <div className="chart-section">
          <div className="chart-wrapper">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
      
      <div className="chart-summary">
        <div className="summary-grid">
          <div className="summary-item error">
            <div className="summary-icon">⚠️</div>
            <div className="summary-content">
              <div className="summary-count">{chartData.error}</div>
              <div className="summary-label">Errors</div>
            </div>
          </div>
          <div className="summary-item warn">
            <div className="summary-icon">⚡</div>
            <div className="summary-content">
              <div className="summary-count">{chartData.warn}</div>
              <div className="summary-label">Warnings</div>
            </div>
          </div>
          <div className="summary-item info">
            <div className="summary-icon">ℹ️</div>
            <div className="summary-content">
              <div className="summary-count">{chartData.info}</div>
              <div className="summary-label">Info</div>
            </div>
          </div>
          <div className="summary-item debug">
            <div className="summary-icon">🔍</div>
            <div className="summary-content">
              <div className="summary-count">{chartData.debug}</div>
              <div className="summary-label">Debug</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogChart; 