const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
    await pool.query('DROP TABLE IF EXISTS rsvps');
    await pool.query('DROP TABLE IF EXISTS events');
    await pool.query('DROP TABLE IF EXISTS users');

    await pool.query(`
        CREATE TABLE users(
            user_id SERIAL PRIMARY KEY,
            username TEXT NOT NULL,
            password_hash TEXT NOT NULL

    );
    `);

    await pool.query(`
        CREATE TABLE events (
            event_id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            event_type TEXT NOT NULL,
            max_capacity INT NOT NULL,
            user_id INT REFERENCES users(user_id) ON DELETE CASCADE

        );
        `);

    await pool.query(`
            CREATE TABLE rsvps (
            rsvp_id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
            event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
            UNIQUE (user_id, event_id)
            );
            `);


    // Hash Passwords
    const aliceHash = await bcrypt.hash('password123', SALT_ROUNDS);
    const bobHash = await bcrypt.hash('hunter2', SALT_ROUNDS);
    const carolHash = await bcrypt.hash('jinglebells25', SALT_ROUNDS);
    const myloHash = await bcrypt.hash('fifthforever55', SALT_ROUNDS);

    // Seed users
    const insertUserSql = `INSERT INTO users(username, password_hash) VALUES ($1, $2) RETURNING user_id;`;


    const aliceRes = await pool.query(insertUserSql, ['alice', aliceHash]);
    const bobRes = await pool.query(insertUserSql, ['bob', bobHash]);
    const carolRes = await pool.query(insertUserSql, ['carol', carolHash]);
    const myloRes = await pool.query(insertUserSql, ['mylo', myloHash]);

    const aliceId = aliceRes.rows[0].user_id;
    const bobId = bobRes.rows[0].user_id;
    const carolId = carolRes.rows[0].user_id;
    const myloId = myloRes.rows[0].user_id;


    // Seed events
    const eventSql = `INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) 
    VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING event_id
    `;

    const mixerRes = await pool.query(eventSql, ['Tech Mixer', 'Network with local devs', '12-10-2026', 'Manhattan', 'networking', 50, aliceId]);
    const cookOutRes = await pool.query(eventSql, ['Project 5th', '5th Bloxk mixed with project X', '08-29-2026', 'Brooklyn', 'Social', 55, bobId]);
    const popUpRes = await pool.query(eventSql, ['Pop-Up Shop', 'Clothing brand pop up shop', '09-07-2026', 'Manhattan', 'Social', 100, myloId])

    const mixerId = mixerRes.rows[0].event_id;
    const cookOutId = cookOutRes.rows[0].event_id;
    const popUpId = popUpRes.rows[0].event_id;

    // Seed rsvps
    const rsvpSql = `INSERT INTO rsvps (user_id, event_id) VALUES($1, $2)`;
    await pool.query(rsvpSql, [bobId, mixerId]);
    await pool.query(rsvpSql, [carolId, cookOutId]);
    await pool.query(rsvpSql, [aliceId, cookOutId]);
    await pool.query(rsvpSql, [myloId, popUpId]);

    console.log('Database seeded successfully!')
};

seed()

    .catch((err) => {
        console.error('Error seeding database:', err);
        process.exit(1);
    })
    .finally(() => pool.end());