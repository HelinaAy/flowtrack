const db = require('../config/db').promise();

const Cycle = {
  create: async (userId, lastPeriodDate, cycleLength, periodLength) => {
    const [result] = await db.query(
      'INSERT INTO cycles (user_id, last_period_date, cycle_length, period_length) VALUES (?, ?, ?, ?)',
      [userId, lastPeriodDate, cycleLength, periodLength]
    );
    return result.insertId;
  },

  findByUserId: async (userId) => {
    const [rows] = await db.query(
      'SELECT * FROM cycles WHERE user_id = ? ORDER BY id DESC LIMIT 1',
      [userId]
    );
    return rows[0];
  },

  findAllByUserId: async (userId) => {
    const [rows] = await db.query(
      'SELECT * FROM cycles WHERE user_id = ? ORDER BY last_period_date DESC',
      [userId]
    );
    return rows;
  },

  update: async (id, lastPeriodDate, cycleLength, periodLength) => {
    await db.query(
      'UPDATE cycles SET last_period_date = ?, cycle_length = ?, period_length = ? WHERE id = ?',
      [lastPeriodDate, cycleLength, periodLength, id]
    );
  }
};

module.exports = Cycle;