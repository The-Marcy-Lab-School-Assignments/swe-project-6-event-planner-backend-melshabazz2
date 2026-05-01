const pool = require('../db/pool');

const rsvpModel = {
    create: async (user_id, event_id) => {
        const query = `
        INSERT INTO rsvps (user_id, event_id) VALUES($1, $2)
        ON CONFLICT (user_id, event_id) DO NOTHING RETURNING *;
        `;

        const { rows } = await pool.query(query, [user_id, event_id]);
        return rows[0];
    },

    delete: async (user_id, event_id) => {
        const query = `
        DELETE FROM rsvps WHERE user_id = $1 AND event_id = $2 RETURNING *;
        `;

        const { rows } = await pool.query(query, [user_id, event_id]);
        return rows[0] || null;
    },

    listByUserId: async (user_id) => {
        const query = `
        SELECT 
        events.*, 
        users.username, 
        (SELECT COUNT(*) FROM rsvps WHERE rsvps.event_id = events.event_id) AS rsvp_count
      FROM rsvps
      JOIN events ON rsvps.event_id = events.event_id
      JOIN users ON events.user_id = users.user_id
      WHERE rsvps.user_id = $1
      ORDER BY events.date ASC;
        `;

        const { rows } = await pool.query(query, [user_id]);
        return rows;
    }
};

module.exports = rsvpModel;