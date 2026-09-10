const Log = require('../models/Log');

exports.createLog = async (req, res) => {
  try {
    const { logDate, flow, mood, symptoms, notes } = req.body;

    if (!logDate) {
      return res.status(400).json({ message: 'Log date is required' });
    }

    // Check if a log already exists for this date — update instead of duplicating
    const existing = await Log.findByDate(req.userId, logDate);
    if (existing) {
      await Log.update(existing.id, flow, mood, symptoms, notes);
      return res.json({ message: 'Log updated successfully' });
    }

    const logId = await Log.create(req.userId, logDate, flow, mood, symptoms, notes);
    res.status(201).json({ message: 'Log created successfully', logId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.findByUserId(req.userId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLogByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const log = await Log.findByDate(req.userId, date);
    res.json(log || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    await Log.delete(req.params.id);
    res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getSymptomStats = async (req, res) => {
  try {
    const logs = await Log.findByUserId(req.userId);

    const counts = {};
    logs.forEach((log) => {
      if (!log.symptoms) return;
      log.symptoms.split(',').forEach((symptom) => {
        const s = symptom.trim();
        if (!s) return;
        counts[s] = (counts[s] || 0) + 1;
      });
    });

    const result = Object.entries(counts)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};