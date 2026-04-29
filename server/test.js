require('dotenv').config();
const eventModel = require('./models/eventModel');

const test = async () => {
    try {
        console.log("--- Testing eventModel.list() ---");
        const events = await eventModel.list();

        if (events.length === 0) {
            console.log("No events found. Did you seed the database?");
        } else {
            console.table(events); // console.table makes it look nice in the terminal
            console.log(`Success! Found ${events.length} events.`);
        }
    } catch (err) {
        console.error("Test failed! Check your SQL query in eventModel.js.");
        console.error(err);
    } finally {
        process.exit(); // Closes the database connection
    }
};

test();