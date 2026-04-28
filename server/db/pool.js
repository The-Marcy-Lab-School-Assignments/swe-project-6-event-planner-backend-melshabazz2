require('dotenv').config(); // Loads .env variables into process.env
const { Pool } = require('pg');

// Create a new pool using your .env credentials
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;
