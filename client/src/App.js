import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Customers from './pages/Customers';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">📦 OrderMgmt</div>
      <nav>
        <NavLink to="/" end>🏠 Dashboard</NavLink>
        <NavLink to="/orders">📋 Orders</NavLink>
        <NavLink to="/customers">👥 Customers</NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
