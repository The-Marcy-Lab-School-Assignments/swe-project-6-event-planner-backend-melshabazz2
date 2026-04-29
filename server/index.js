require('dotenv').config();

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

// ====================================
// API Routes (Match your API Contract)
// ====================================

// Auth & Users
app.post('/api/users', authControllers.register);
app.post('/api/session', authControllers.login);
app.get('/api/me', authControllers.getMe);
app.delete('/api/session', authControllers.logout);

// Events (Public)
app.get('/api/events', eventControllers.list);

// Events (Protected)
app.post('/api/events', checkAuthentication, eventControllers.create);
app.delete('/api/events/:event_id', checkAuthentication, eventControllers.delete);

// RSVPs (Protected)
app.post('/api/rsvps', checkAuthentication, rsvpControllers.create);
app.delete('/api/rsvps/:rsvp_id', checkAuthentication, rsvpControllers.delete);

// ====================================
// Listen
// ====================================
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));