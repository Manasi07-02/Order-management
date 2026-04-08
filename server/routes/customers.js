const express = require('express');
const router = express.Router();

// GET all customers
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  db.query('SELECT * FROM customers ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// POST create customer
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { name, email, phone, address } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

  db.query(
    'INSERT INTO customers (name, email, phone, address) VALUES (?,?,?,?)',
    [name, email || '', phone || '', address || ''],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({ success: true, message: 'Customer created', id: result.insertId });
    }
  );
});

// PUT update customer
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { name, email, phone, address } = req.body;

  db.query(
    'UPDATE customers SET name=?, email=?, phone=?, address=? WHERE id=?',
    [name, email, phone, address, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Customer not found' });
      res.json({ success: true, message: 'Customer updated' });
    }
  );
});

// DELETE customer
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  db.query('DELETE FROM customers WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer deleted' });
  });
});

module.exports = router;
