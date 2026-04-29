const pool = require('../db/pool')

const userModel = {
    create: async (username, password_hash) => {
        const query = `
        INSERT INTO users(username, password_hash) VALUES ($1, $2) RETURNING user_id, username;
        `;

        const { rows } = await pool.query(query, [username, password_hash]);

        return rows[0];
    },

    findByUsername: async (username) => {
        const query = `SELECT * FROM users WHERE username = $1;`;
        const { rows } = await pool.query(query, [username]);
        return rows[0];
    },

    findById: async (user_id) => {
        const query = `SELECT * FROM users WHERE user_id = $1;`;
        const { rows } = await pool.query(query, [user_id]);
        return rows[0]
    }
};

module.exports = userModel;