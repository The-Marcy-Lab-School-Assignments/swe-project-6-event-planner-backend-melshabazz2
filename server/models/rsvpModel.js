const pool = require('../db/pool');

const rsvpModel = {
    create: async (user_id, event_id) => {
        const query = `
        INSERT INTO rsvps (user_id, event_id) VALUES($1, $2)
        ON CONFLICT (user_id, event_id) DO NOTHING RETURNING *;
        `;

        const { rows } = await pool.query(query, [user_id, event_id]);
        return rows[0];
    }
}
module.exports = rsvpModel;