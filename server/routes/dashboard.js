const express = require('express');
const router = express.Router();

router.get('/stats', (req, res) => {
  const db = req.app.locals.db;

  const queries = {
    totalOrders: 'SELECT COUNT(*) as count FROM orders',
    totalRevenue: "SELECT SUM(price * quantity) as total FROM orders WHERE status != 'cancelled'",
    statusBreakdown: 'SELECT status, COUNT(*) as count FROM orders GROUP BY status',
    recentOrders: 'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5',
    totalCustomers: 'SELECT COUNT(*) as count FROM customers',
    monthlyRevenue: `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(price * quantity) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE status != 'cancelled' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `
  };

  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.query(query, (err, rows) => {
      if (!err) results[key] = rows;
      completed++;
      if (completed === total) {
        res.json({
          success: true,
          data: {
            totalOrders: results.totalOrders?.[0]?.count || 0,
            totalRevenue: results.totalRevenue?.[0]?.total || 0,
            totalCustomers: results.totalCustomers?.[0]?.count || 0,
            statusBreakdown: results.statusBreakdown || [],
            recentOrders: results.recentOrders || [],
            monthlyRevenue: results.monthlyRevenue || []
          }
        });
      }
    });
  });
});

module.exports = router;
