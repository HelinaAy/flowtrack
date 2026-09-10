const db = require('../config/db').promise();

const Log = {
  create: async (userId, logDate, flow, mood, symptoms, notes) => {
    const [result] = await db.query(
      'INSERT INTO logs (user_id, log_date, flow, mood, symptoms, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, logDate, flow, mood, symptoms, notes]
    );
    return result.insertId;
  },

  findByUserId: async (userId) => {
    const [rows] = await db.query(
      'SELECT * FROM logs WHERE user_id = ? ORDER BY log_date DESC',
      [userId]
    );
    return rows;
  },

  findByDate: async (userId, logDate) => {
    const [rows] = await db.query(
      'SELECT * FROM logs WHERE user_id = ? AND log_date = ?',
      [userId, logDate]
    );
    return rows[0];
  },

  update: async (id, flow, mood, symptoms, notes) => {
    await db.query(
      'UPDATE logs SET flow = ?, mood = ?, symptoms = ?, notes = ? WHERE id = ?',
      [flow, mood, symptoms, notes, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM logs WHERE id = ?', [id]);
  }
};

module.exports = Log;