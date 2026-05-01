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
            username TEXT NOT NULL UNIQUE,
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
    const majHash = await bcrypt.hash('fifthpower55', SALT_ROUNDS);

    // Seed users
    const insertUserSql = `INSERT INTO users(username, password_hash) VALUES ($1, $2) RETURNING user_id;`;


    const aliceRes = await pool.query(insertUserSql, ['alice', aliceHash]);
    const bobRes = await pool.query(insertUserSql, ['bob', bobHash]);
    const carolRes = await pool.query(insertUserSql, ['carol', carolHash]);
    const myloRes = await pool.query(insertUserSql, ['mylo', myloHash]);
    const majRes = await pool.query(insertUserSql, ['maj', majHash]);

    const aliceId = aliceRes.rows[0].user_id;
    const bobId = bobRes.rows[0].user_id;
    const carolId = carolRes.rows[0].user_id;
    const myloId = myloRes.rows[0].user_id;
    const majId = majRes.rows[0].user_id;



    // Seed events
    const eventSql = `INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) 
    VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING event_id
    `;

    const mixerRes = await pool.query(eventSql, ['Tech Mixer', 'Network with local devs', '2026-10-09', 'Manhattan', 'networking', 50, aliceId]);
    const cookOutRes = await pool.query(eventSql, ['Project 5th', '5th Bloxk mixed with project X', '2026-08-29', 'Brooklyn', 'social', 55, bobId]);
    const popUpRes = await pool.query(eventSql, ['Pop-Up Shop', 'Clothing brand pop up shop', '2026-09-07', 'Manhattan', 'social', 100, myloId]);
    const fifthBallRes = await pool.query(eventSql, ['Basketball Tournament', 'Battle of the Ballers', '2026-09-13', '5th Bloxk Mansion', 'sports', 100, majId]);
    const fifthTourRes = await pool.query(eventSql, ['5EVER', '5th Bloxk Presents 5EVER a night to remember!', '2026-09-14', 'Barclays Center', 'concert', 555, majId]);

    const mixerId = mixerRes.rows[0].event_id;
    const cookOutId = cookOutRes.rows[0].event_id;
    const popUpId = popUpRes.rows[0].event_id;
    const fifthBallId = fifthBallRes.rows[0].event_id;
    const fifthTourId = fifthTourRes.rows[0].event_id;

    // Seed rsvps
    const rsvpSql = `INSERT INTO rsvps (user_id, event_id) VALUES($1, $2)`;

    // Mixer Rsvps
    await pool.query(rsvpSql, [bobId, mixerId]);
    await pool.query(rsvpSql, [carolId, mixerId]);
    await pool.query(rsvpSql, [myloId, mixerId]);
    await pool.query(rsvpSql, [majId, mixerId]);
    await pool.query(rsvpSql, [aliceId, mixerId]);

    // CookOut Rsvps
    await pool.query(rsvpSql, [carolId, cookOutId]);
    await pool.query(rsvpSql, [aliceId, cookOutId]);
    await pool.query(rsvpSql, [majId, cookOutId]);
    await pool.query(rsvpSql, [myloId, cookOutId]);
    await pool.query(rsvpSql, [bobId, cookOutId]);

    //PopUp Rsvps
    await pool.query(rsvpSql, [myloId, popUpId]);
    await pool.query(rsvpSql, [majId, popUpId]);
    await pool.query(rsvpSql, [bobId, popUpId]);
    await pool.query(rsvpSql, [aliceId, popUpId]);
    await pool.query(rsvpSql, [carolId, popUpId]);

    // Basketball Rsvps
    await pool.query(rsvpSql, [majId, fifthBallId]);
    await pool.query(rsvpSql, [myloId, fifthBallId]);
    await pool.query(rsvpSql, [aliceId, fifthBallId]);
    await pool.query(rsvpSql, [bobId, fifthBallId]);
    await pool.query(rsvpSql, [carolId, fifthBallId]);

    // Concert Rsvps
    await pool.query(rsvpSql, [majId, fifthTourId]);
    await pool.query(rsvpSql, [myloId, fifthTourId]);
    await pool.query(rsvpSql, [aliceId, fifthTourId]);
    await pool.query(rsvpSql, [carolId, fifthTourId]);
    await pool.query(rsvpSql, [bobId, fifthTourId]);


    console.log('Database seeded successfully!')
};

seed()

    .catch((err) => {
        console.error('Error seeding database:', err);
        process.exit(1);
    })
    .finally(() => pool.end());