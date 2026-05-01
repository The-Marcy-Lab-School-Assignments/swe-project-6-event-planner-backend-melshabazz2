require('dotenv').config();
console.log('running')
const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');

// Middleware Imports
const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');

// Controller Imports (We will build these in Phase 3)
const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');
const eventControllers = require('./controllers/eventControllers');
const rsvpControllers = require('./controllers/rsvpControllers');

const app = express();

// ✍️ TODO 2: Replace hard-coded PORT
const PORT = process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================
app.use(logRoutes);

// ✍️ TODO 3: Replace hard-coded secret
app.use(cookieSession({
    name: 'session',
    secret: process.env.SESSION_SECRET, // Using .env secret
    maxAge: 24 * 60 * 60 * 1000,
}));

app.use(express.json());
// const pathToFrontend = ;


// ====================================
// API Routes (Match your API Contract)
// ====================================

// app.get('/', (req, res) => {
//     res.send('<h1>EventPlanner API is Online</h1><p>Visit <a href="/api/events">/api/events</a> to see data.</p>');
// });

// Auth
app.post('/api/auth/register', authControllers.register); // FIX: Path name
app.post('/api/auth/login', authControllers.login);       // FIX: Path name
app.get('/api/auth/me', authControllers.getMe);
app.delete('/api/auth/logout', authControllers.logout);   // FIX: Path name

// User Account Management
app.patch('/api/users/:user_id', checkAuthentication, userControllers.updatePassword); // ADDED
app.delete('/api/users/:user_id', checkAuthentication, userControllers.deleteAccount); // ADDED

// Events
app.get('/api/events', eventControllers.list);
app.get('/api/users/:user_id/events', eventControllers.listByUserId); // ADDED
app.post('/api/events', checkAuthentication, eventControllers.create);
app.patch('/api/events/:event_id', checkAuthentication, eventControllers.update);      // ADDED
app.delete('/api/events/:event_id', checkAuthentication, eventControllers.delete);

// RSVPs
app.get('/api/users/:user_id/rsvps', rsvpControllers.listUserRSVPs); // ADDED
app.post('/api/events/:event_id/rsvps', checkAuthentication, rsvpControllers.create); // FIX: Param name
app.delete('/api/events/:event_id/rsvps', checkAuthentication, rsvpControllers.delete); // FIX: Param name

// ====================================
// Static Middleware
// ====================================
app.use(express.static(path.join(__dirname, '../frontend')));

// ====================================
// Global Error Handler (Required for Rubric)
// ====================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Internal server error" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));