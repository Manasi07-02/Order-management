const express = require('express');
const router = express.Router();

// GET all orders
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const { status, search } = req.query;

  let query = 'SELECT * FROM orders';
  const params = [];

  if (status && status !== 'all') {
    query += ' WHERE status = ?';
    params.push(status);
  }

  if (search) {
    const clause = params.length ? ' AND' : ' WHERE';
    query += `${clause} (customer_name LIKE ? OR product LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// GET single order
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.query('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!results.length) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: results[0] });
  });
});

// POST create order
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { customer_id, customer_name, product, quantity, price, status, notes } = req.body;

  if (!product || !quantity || !price || !customer_name) {
    return res.status(400).json({ success: false, message: 'customer_name, product, quantity and price are required' });
  }

  db.query(
    'INSERT INTO orders (customer_id, customer_name, product, quantity, price, status, notes) VALUES (?,?,?,?,?,?,?)',
    [customer_id || null, customer_name, product, quantity, price, status || 'pending', notes || ''],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({ success: true, message: 'Order created', id: result.insertId });
    }
  );
});

// PUT update order
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { customer_name, product, quantity, price, status, notes } = req.body;

  db.query(
    'UPDATE orders SET customer_name=?, product=?, quantity=?, price=?, status=?, notes=? WHERE id=?',
    [customer_name, product, quantity, price, status, notes, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Order not found' });
      res.json({ success: true, message: 'Order updated' });
    }
  );
});

// PATCH update status only
router.patch('/:id/status', (req, res) => {
  const db = req.app.locals.db;
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  db.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Status updated' });
  });
});

// DELETE order
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.query('DELETE FROM orders WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  });
});

module.exports = router;
