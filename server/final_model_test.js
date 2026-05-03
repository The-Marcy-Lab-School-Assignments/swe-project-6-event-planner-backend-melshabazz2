require('dotenv').config();
const userModel = require('./models/userModel');
const eventModel = require('./models/eventModel');

const runFinalTest = async () => {
    try {
        console.log("--- 1. Testing userModel.create ---");
        const newUser = await userModel.create('test_user_99', 'password_hash_here');
        console.log("Created User:", newUser.username);

        console.log("\n--- 2. Testing eventModel.create ---");
        const newEvent = await eventModel.create({
            title: 'Model Test Party',
            description: 'Testing Phase 2',
            date: '2026-05-01',
            location: 'The Terminal',
            event_type: 'social',
            max_capacity: 10,
            user_id: newUser.user_id
        });
        console.log("Created Event:", newEvent.title);

        console.log("\n--- 3. Verifying List includes new event ---");
        const allEvents = await eventModel.list();
        const found = allEvents.find(e => e.title === 'Model Test Party');
        console.log(found ? "✅ New event found in list with creator name!" : "❌ Event missing!");

        console.log("\n--- 4. Testing eventModel.delete ---");
        const deleted = await eventModel.delete(newEvent.event_id, newUser.user_id);
        console.log(deleted ? "✅ Event successfully deleted!" : "❌ Delete failed!");

    } catch (err) {
        console.error("PHASE 2 ERROR:", err.message);
    } finally {
        process.exit();
    }
};

runFinalTest();
