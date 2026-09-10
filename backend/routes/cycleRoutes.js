const express = require('express');
const router = express.Router();
const { saveCycle, getCycle, getCycleHistory, getDashboardSummary } = require('../controllers/cycleController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, saveCycle);
router.get('/', authMiddleware, getCycle);
router.get('/history', authMiddleware, getCycleHistory);
router.get('/summary', authMiddleware, getDashboardSummary);
module.exports = router;