const express = require('express');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;
const LOGS_FILE = path.join(__dirname, 'logs.json');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://log-system-1.onrender.com',
    'https://log-system-1.onrender.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received from client:', data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function broadcastNewLog(log) {
  const message = JSON.stringify({
    type: 'NEW_LOG',
    data: log
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function validateLogData(req, res, next) {
  const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'];
  const { body } = req;

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Request body must be an object' });
  }

  const missingFields = requiredFields.filter(field => !(field in body));
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: 'Missing required fields', 
      missingFields: missingFields 
    });
  }

  const emptyFields = requiredFields.filter(field => {
    const value = body[field];
    return value === null || value === undefined || value === '';
  });

  if (emptyFields.length > 0) {
    return res.status(400).json({ 
      error: 'Required fields cannot be empty', 
      emptyFields: emptyFields 
    });
  }

  next();
}

function readLogs() {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      const data = fs.readFileSync(LOGS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading logs file:', error);
    return [];
  }
}

function writeLogs(logs) {
  try {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing logs file:', error);
    return false;
  }
}

app.post('/logs', validateLogData, (req, res) => {
  try {
    const newLog = {
      id: Date.now(),
      serverTimestamp: new Date().toISOString(),
      ...req.body
    };

    const logs = readLogs();
    logs.push(newLog);

    if (writeLogs(logs)) {
      broadcastNewLog(newLog);
      res.status(201).json({ message: 'Log created successfully', log: newLog });
    } else {
      res.status(500).json({ error: 'Failed to save log' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
});

app.get('/logs', (req, res) => {
  try {
    const logs = readLogs();
    const { level, message, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit } = req.query;
    
    let filteredLogs = logs;

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (message) {
      filteredLogs = filteredLogs.filter(log => 
        log.message && log.message.toLowerCase().includes(message.toLowerCase())
      );
    }

    if (resourceId) {
      filteredLogs = filteredLogs.filter(log => log.resourceId === resourceId);
    }

    if (timestamp_start || timestamp_end) {
      filteredLogs = filteredLogs.filter(log => {
        if (!log.timestamp) return false;
        
        const logTimestamp = new Date(log.timestamp);
        
        if (timestamp_start && logTimestamp < new Date(timestamp_start)) {
          return false;
        }
        
        if (timestamp_end && logTimestamp > new Date(timestamp_end)) {
          return false;
        }
        
        return true;
      });
    }

    if (traceId) {
      filteredLogs = filteredLogs.filter(log => log.traceId === traceId);
    }

    if (spanId) {
      filteredLogs = filteredLogs.filter(log => log.spanId === spanId);
    }

    if (commit) {
      filteredLogs = filteredLogs.filter(log => log.commit === commit);
    }

    res.json(filteredLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on port ${PORT}`);
}); 