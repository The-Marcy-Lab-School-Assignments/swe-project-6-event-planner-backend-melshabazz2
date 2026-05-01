const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const userControllers = {
    updatePassword: async (req, res) => {
        try {
            const { user_id } = req.params;
            const { password } = req.body;

            if (!password) return res.status(400).json({ message: 'Password is required' });

            if (Number(user_id) !== req.session.user_id) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const password_hash = await bcrypt.hash(password, 8);

            const user = await userModel.updatePassword(user_id, password_hash);

            if (!user) return res.status(404).json({ message: 'User not found' });

            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteAccount: async (req, res) => {
        try {
            const { user_id } = req.params;

            if (Number(user_id) !== req.session.user_id) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const user = await userModel.delete(user_id);

            if (!user) return res.status(404).json({ message: 'User not found' });

            req.session.destroy();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = userControllers;