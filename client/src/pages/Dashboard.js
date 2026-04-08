import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/dashboard/stats')
      .then(res => setStats(res.data.data))
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  const statusColors = {
    pending: '#f59e0b', processing: '#3b82f6',
    shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444'
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Orders</div>
          <div className="value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Revenue</div>
          <div className="value">₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Customers</div>
          <div className="value">{stats.totalCustomers}</div>
        </div>
        <div className="stat-card">
          <div className="label">Delivered</div>
          <div className="value">{stats.statusBreakdown.find(s => s.status === 'delivered')?.count || 0}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Status Breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Orders by Status</h3>
          {stats.statusBreakdown.map(s => (
            <div key={s.status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className={`badge ${s.status}`}>{s.status}</span>
              <strong>{s.count}</strong>
            </div>
          ))}
          {!stats.statusBreakdown.length && <p style={{ color: '#64748b' }}>No orders yet</p>}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Recent Orders</h3>
          {stats.recentOrders.map(o => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
              <div>
                <strong>{o.customer_name}</strong>
                <div style={{ color: '#64748b', fontSize: 12 }}>{o.product}</div>
              </div>
              <span className={`badge ${o.status}`}>{o.status}</span>
            </div>
          ))}
          {!stats.recentOrders.length && <p style={{ color: '#64748b' }}>No orders yet</p>}
        </div>
      </div>
    </div>
  );
}
