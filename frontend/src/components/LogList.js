import React from 'react';
import './LogList.css';

const LogList = ({ logs, loading, error, onRefresh, wsConnected }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error': return '#dc3545';
      case 'warn': return '#fd7e14';
      case 'info': return '#0dcaf0';
      case 'debug': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getLevelBackgroundColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error': return 'rgba(220, 53, 69, 0.1)';
      case 'warn': return 'rgba(253, 126, 20, 0.1)';
      case 'info': return 'rgba(13, 202, 240, 0.1)';
      case 'debug': return 'rgba(108, 117, 125, 0.1)';
      default: return 'rgba(108, 117, 125, 0.1)';
    }
  };

  const getLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'error': return '⚠️';
      case 'warn': return '⚡';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="logs-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logs-container">
        <div className="error">
          <strong>Error:</strong> {error}
          <button className="btn btn-retry" onClick={onRefresh}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="logs-container">
      <div className="logs-header">
        <div className="logs-summary">
          Showing {logs.length} log{logs.length !== 1 ? 's' : ''}
        </div>
        <div className="logs-controls">
          <div className={`websocket-status ${wsConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {wsConnected ? 'Real-time' : 'Disconnected'}
          </div>
          <button className="btn btn-refresh" onClick={onRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>
      
      {logs.length === 0 ? (
        <div className="no-logs">
          <div className="no-logs-icon">📋</div>
          <h3>No logs found</h3>
          <p>No logs match the current filters. Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="logs-list">
          {logs.map(log => (
            <div 
              key={log.id} 
              className="log-entry"
              style={{ 
                borderLeftColor: getLevelColor(log.level),
                backgroundColor: getLevelBackgroundColor(log.level)
              }}
            >
              <div className="log-header">
                <div className="log-level-badge">
                  <span className="log-level-icon">
                    {getLevelIcon(log.level)}
                  </span>
                  <span 
                    className="log-level-text" 
                    style={{ color: getLevelColor(log.level) }}
                  >
                    {log.level?.toUpperCase()}
                  </span>
                </div>
                <span className="log-timestamp">
                  {formatTimestamp(log.timestamp)}
                </span>
                <span className="log-resource">
                  Resource: {log.resourceId}
                </span>
              </div>
              
              <div className="log-message">
                {log.message}
              </div>
              
              <div className="log-metadata">
                <div className="log-meta-row">
                  <div className="log-meta-item">
                    <strong>Trace ID:</strong> 
                    <code>{log.traceId}</code>
                  </div>
                  <div className="log-meta-item">
                    <strong>Span ID:</strong> 
                    <code>{log.spanId}</code>
                  </div>
                  <div className="log-meta-item">
                    <strong>Commit:</strong> 
                    <code>{log.commit}</code>
                  </div>
                </div>
                {log.metadata && (
                  <div className="log-meta-item log-meta-full">
                    <strong>Metadata:</strong>
                    <pre className="metadata-json">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogList; 