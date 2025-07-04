import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const handleInputChange = (key, value) => {
    onFilterChange(key, value);
  };

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <h2>Filter Logs</h2>
        <button className="btn btn-clear" onClick={handleClear}>
          Clear All
        </button>
      </div>
      
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="message">Message Search:</label>
          <input
            id="message"
            type="text"
            placeholder="Search in messages..."
            value={filters.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="level">Level:</label>
          <select
            id="level"
            value={filters.level}
            onChange={(e) => handleInputChange('level', e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="resourceId">Resource ID:</label>
          <input
            id="resourceId"
            type="text"
            placeholder="Enter resource ID..."
            value={filters.resourceId}
            onChange={(e) => handleInputChange('resourceId', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="timestampStart">From Date:</label>
          <input
            id="timestampStart"
            type="datetime-local"
            value={filters.timestampStart}
            onChange={(e) => handleInputChange('timestampStart', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="timestampEnd">To Date:</label>
          <input
            id="timestampEnd"
            type="datetime-local"
            value={filters.timestampEnd}
            onChange={(e) => handleInputChange('timestampEnd', e.target.value)}
          />
        </div>
      </div>
      
      <div className="active-filters">
        {Object.entries(filters).some(([key, value]) => value) && (
          <div className="active-filters-list">
            <span className="active-filters-label">Active Filters:</span>
            {Object.entries(filters).map(([key, value]) => 
              value ? (
                <span key={key} className="active-filter-tag">
                  {key}: {value}
                  <button 
                    className="remove-filter" 
                    onClick={() => handleInputChange(key, '')}
                  >
                    ×
                  </button>
                </span>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar; 