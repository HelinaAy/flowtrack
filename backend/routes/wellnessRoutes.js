const express = require('express');
const router = express.Router();
const { getWellnessTips } = require('../controllers/wellnessController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getWellnessTips);

module.exports = router;