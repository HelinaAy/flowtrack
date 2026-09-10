const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createLog, getLogs, getLogByDate, deleteLog, getSymptomStats } = require('../controllers/logController');

router.post('/', authMiddleware, createLog);
router.get('/', authMiddleware, getLogs);
router.get('/stats/symptoms', authMiddleware, getSymptomStats);
router.get('/:date', authMiddleware, getLogByDate);
router.delete('/:id', authMiddleware, deleteLog);

module.exports = router;