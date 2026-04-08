# Order Management System

Full-stack app: React + Node.js + MySQL (Railway + Render)

## Folder Structure
```
order-management/
├── server/          ← Node.js backend
│   ├── server.js
│   ├── config/db.js
│   ├── routes/
│   │   ├── orders.js
│   │   ├── customers.js
│   │   └── dashboard.js
│   ├── .env.example
│   └── package.json
└── client/          ← React frontend
    ├── src/
    │   ├── index.js
    │   ├── App.js
    │   ├── api.js
    │   ├── index.css
    │   └── pages/
    │       ├── Dashboard.js
    │       ├── Orders.js
    │       └── Customers.js
    ├── public/index.html
    ├── .env.example
    └── package.json
```

## Local Setup

### 1. Backend
```bash
cd server
cp .env.example .env   # fill in your Railway DB credentials
npm install
npm run dev
```

### 2. Frontend
```bash
cd client
cp .env.example .env   # set REACT_APP_API_URL=http://localhost:5000
npm install
npm start
```

---

## Deploy to Render

### Backend (Web Service)
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables: Add all from `.env.example` (use Railway values)

### Frontend (Static Site)
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`
- Environment Variables:
  - `REACT_APP_API_URL` = your backend Render URL (e.g. https://your-backend.onrender.com)
- Redirects/Rewrites: Add rule `/* → /index.html` (Rewrite)

---

## Features
- Dashboard with stats (total orders, revenue, customers)
- Orders: Create, Edit, Delete, Filter by status, Search
- Customers: Create, Edit, Delete
- Status updates inline from the orders table
- Auto-creates DB tables on first run
