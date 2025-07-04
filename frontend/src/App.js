import React, { useState, useEffect } from 'react';
import './App.css';
import FilterBar from './components/FilterBar';
import LogList from './components/LogList';
import LogChart from './components/LogChart';
import Notification from './components/Notification';

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    message: '',
    level: '',
    resourceId: '',
    timestampStart: '',
    timestampEnd: ''
  });
  const [wsConnected, setWsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchLogs = async (filterParams = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filterParams.message) queryParams.append('message', filterParams.message);
      if (filterParams.level) queryParams.append('level', filterParams.level);
      if (filterParams.resourceId) queryParams.append('resourceId', filterParams.resourceId);
      if (filterParams.timestampStart) queryParams.append('timestamp_start', filterParams.timestampStart);
      if (filterParams.timestampEnd) queryParams.append('timestamp_end', filterParams.timestampEnd);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/logs?${queryString}` : '/logs';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setWsConnected(true);
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'NEW_LOG') {
          const newLog = message.data;
          setLogs(prevLogs => {
            const exists = prevLogs.find(log => log.id === newLog.id);
            if (!exists) {
              addNotification(
                `New ${newLog.level} log received: ${newLog.message.substring(0, 50)}${newLog.message.length > 50 ? '...' : ''}`,
                'success'
              );
              return [newLog, ...prevLogs];
            }
            return prevLogs;
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setWsConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };
    
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLogs(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      message: '',
      level: '',
      resourceId: '',
      timestampStart: '',
      timestampEnd: ''
    });
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };



  return (
    <div className="App">
      <header className="App-header">
        <h1>Logs Viewer</h1>
      </header>
      
            <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      <LogChart 
        logs={logs}
        filters={filters}
      />
      
      <LogList 
        logs={logs}
        loading={loading}
        error={error}
        onRefresh={fetchLogs}
        wsConnected={wsConnected}
      />
      
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

export default App; 