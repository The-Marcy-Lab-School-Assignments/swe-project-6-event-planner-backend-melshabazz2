const bcrypt = require('bcrypt');
const pool = require('./pool')

const SALT_ROUNDS = 8;

const seed = async () => {
    await pool.query('DROP TABLE IF EXISTS rsvp');
    await pool.query('DROP TABLE IF EXISTS events');
    await pool.query('DROP TABLE IF EXISTS users');

    await pool.query('
        CREATE TABLE users(
        user
    )
        
    ');

}