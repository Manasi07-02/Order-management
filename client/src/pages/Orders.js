import React, { useEffect, useState } from 'react';
import api from '../api';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const EMPTY = { customer_name: '', product: '', quantity: 1, price: '', status: 'pending', notes: '' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    const params = {};
    if (filterStatus !== 'all') params.status = filterStatus;
    if (search) params.search = search;
    api.get('/api/orders', { params })
      .then(res => setOrders(res.data.data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const handleSearch = e => {
    e.preventDefault();
    fetchOrders();
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = o => { setEditing(o.id); setForm({ customer_name: o.customer_name, product: o.product, quantity: o.quantity, price: o.price, status: o.status, notes: o.notes || '' }); setShowModal(true); };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/api/orders/${editing}`, form);
      } else {
        await api.post('/api/orders', form);
      }
      setShowModal(false);
      fetchOrders();
    } catch {
      alert('Failed to save order');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this order?')) return;
    await api.delete(`/api/orders/${id}`);
    fetchOrders();
  };

  const handleStatusChange = async (id, status) => {
    await api.patch(`/api/orders/${id}/status`, { status });
    fetchOrders();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ New Order</button>
      </div>

      <div className="card">
        <div className="filters">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1 }}>
            <input placeholder="Search by customer or product..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {error && <div className="error">{error}</div>}
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customer_name}</td>
                    <td>{o.product}</td>
                    <td>{o.quantity}</td>
                    <td>₹{Number(o.price).toLocaleString('en-IN')}</td>
                    <td>₹{(o.price * o.quantity).toLocaleString('en-IN')}</td>
                    <td>
                      <select
                        className={`badge ${o.status}`}
                        value={o.status}
                        onChange={e => handleStatusChange(o.id, e.target.value)}
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => openEdit(o)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>Del</button>
                    </td>
                  </tr>
                ))}
                {!orders.length && <tr><td colSpan={9} style={{ textAlign: 'center', color: '#64748b' }}>No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Order' : 'New Order'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Product *</label>
                  <input required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input type="number" min="1" required value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" step="0.01" min="0" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving} style={{ width: '100%' }}>
                {saving ? 'Saving...' : editing ? 'Update Order' : 'Create Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
