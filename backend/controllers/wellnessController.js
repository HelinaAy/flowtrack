const Cycle = require('../models/Cycle');
const getCycleInfo = require('../utils/cyclePredictor');
const wellnessTips = require('../data/wellnessTips');

exports.getWellnessTips = async (req, res) => {
  try {
    const cycle = await Cycle.findByUserId(req.userId);

    if (!cycle) {
      return res.status(404).json({ message: 'No cycle data found. Please set up your cycle info first.' });
    }

    const info = getCycleInfo(cycle.last_period_date, cycle.cycle_length, cycle.period_length);
    const tips = wellnessTips[info.phase];

    res.json({ phase: info.phase, tips });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};