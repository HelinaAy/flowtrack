const Cycle = require('../models/Cycle');
const getCycleInfo = require('../utils/cyclePredictor');

exports.getDashboardSummary = async (req, res) => {
  try {
    const cycle = await Cycle.findByUserId(req.userId);

    if (!cycle) {
      return res.status(404).json({ message: 'No cycle data found. Please set up your cycle info first.' });
    }

    const info = getCycleInfo(cycle.last_period_date, cycle.cycle_length, cycle.period_length);

    res.json({
      cycle,
      ...info
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// CREATE or UPDATE (a user usually only has one "active" cycle setup)
exports.saveCycle = async (req, res) => {
  try {
    const { lastPeriodDate, cycleLength, periodLength } = req.body;

    if (!lastPeriodDate) {
      return res.status(400).json({ message: 'Last period date is required' });
    }

    const existing = await Cycle.findByUserId(req.userId);

    if (existing) {
      await Cycle.update(
        existing.id,
        lastPeriodDate,
        cycleLength || 28,
        periodLength || 5
      );
      return res.json({ message: 'Cycle updated successfully' });
    }

    const cycleId = await Cycle.create(
      req.userId,
      lastPeriodDate,
      cycleLength || 28,
      periodLength || 5
    );
    res.status(201).json({ message: 'Cycle created successfully', cycleId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET current cycle
exports.getCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findByUserId(req.userId);
    if (!cycle) {
      return res.status(404).json({ message: 'No cycle data found. Please set up your cycle info.' });
    }
    res.json(cycle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all cycle history (for Insights chart later)
exports.getCycleHistory = async (req, res) => {
  try {
    const cycles = await Cycle.findAllByUserId(req.userId);
    res.json(cycles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};