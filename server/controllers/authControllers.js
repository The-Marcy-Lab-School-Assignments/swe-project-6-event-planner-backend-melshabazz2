const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const authControllers = {

    register: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

            const password_hash = await bcrypt.hash(password, 8);
            const user = await userModel.create(username, password_hash);

            req.session.user_id = user.user_id;
            res.status(201).json({ user_id: user.user_id, username: user.username });
        } catch (err) {

            if (err.code === '23505') {
                return res.status(409).json({ message: 'Username already taken' });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    login: async (req, res) => {
        const { username, password } = req.body;
        const user = await userModel.findByUsername(username);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.user_id = user.user_id;
        res.status(200).json({ user_id: user.user_id, username: user.username });
    },


    getMe: async (req, res) => {
        if (!req.session.user_id) return res.json(null);

        const user = await userModel.findById(req.session.user_id);
        res.json(user);
    },


    logout: (req, res) => {
        req.session.destroy();
        res.status(200).json({ message: "Logged out." });
    }
};

module.exports = authControllers;
