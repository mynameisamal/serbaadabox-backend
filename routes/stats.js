const express = require('express');
const router = express.Router();
const { 
        getSummaryStats, 
        getDailySales, 
        getTopProducts, 
        getRepeatCustomers 
    } = require('../controllers/statsController');

router.get('/summary', getSummaryStats);
router.get('/daily-sales', getDailySales);
router.get('/top-products', getTopProducts);
router.get('/repeat-users', getRepeatCustomers);

module.exports = router;
