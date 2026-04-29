const pool = require('../db/pool');

const eventModel = {
    list: async () => {
        const query = ` 
        SELECT events.*, users.username AS creator_name,
        COUNT (rsvps.rsvp_id):: INT AS rsvp_count
        FROM events JOIN users ON events.user_id = users.user_id 
        LEFT JOIN rsvps on rsvps.event_id = events.event_id
        GROUP BY events.event_id, users.username;
        `;
        const { rows } = await pool.query(query);
        return rows;
    },

    create: async ({ title, description, date, location, event_type, max_capacity, user_id }) => {

        const query = ` 
        INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
        const { rows } = await pool.query(query, [title, description, date, location, event_type, max_capacity, user_id]);
        return rows[0]
    },

    delete: async (event_id, user_id) => {
        const query = `DELETE FROM events WHERE event_id = $1 AND user_id = $2 RETURNING *;`;
        const { rows } = await pool.query(query, [event_id, user_id]);
        return rows[0];
    }
};

module.exports = eventModel;