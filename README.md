This is a full-stack log viewer built with React and Express. It lets you view, filter, and monitor logs in real-time, with helpful charts and a modern interface.

Features - 

Backend (Express) - 
POST /logs: Add logs with validation

GET /logs: Retrieve logs with flexible filtering (by level, message, resourceId, time range, etc.)

WebSocket support for real-time updates

Logs are stored in a local logs.json file


Frontend (React) - 
Real-time log display using WebSockets

Filters for message, level, resource ID, and timestamp range

Live-updating charts: bar and doughnut

Color-coded log levels and toast notifications

Shows connection status

Fully responsive layout with smooth UI



Getting Started -
1. Start the Backend
bash
Copy
Edit
cd backend
npm install
npm start
2. Start the Frontend
bash
Copy
Edit
cd frontend
npm install
npm start
Backend runs on: http://localhost:3000

Frontend runs on: http://localhost:3001

API Examples - 
Add a Log
bash
Copy
Edit
curl -X POST http://localhost:3000/logs -H "Content-Type: application/json" -d '{
  "level": "error",
  "message": "Database connection failed",
  "resourceId": "server-1",
  "timestamp": "2023-11-20T10:30:00Z",
  "traceId": "abc123",
  "spanId": "span789",
  "commit": "a1b2c3d4",
  "metadata": { "userId": "user1", "requestId": "req123" }
}'
Get Logs
bash
Copy
Edit
curl http://localhost:3000/logs
curl http://localhost:3000/logs?level=error


Real-Time Features- 
WebSocket connects automatically on page load

New logs show up instantly without refreshing

Filters stay active during updates

Charts and dashboard update in real-time


Developer Notes - 
Use nodemon for backend development

React app uses a proxy to talk to the backend

Logs are saved to a JSON file (no database setup needed)