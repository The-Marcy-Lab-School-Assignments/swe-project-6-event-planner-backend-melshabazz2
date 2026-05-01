const rsvpModel = require('../models/rsvpModel');

const rsvpControllers = {
    create: async (req, res) => {
        const { event_id } = req.params;
        const user_id = req.session.user_id;

        const rsvp = await rsvpModel.create(user_id, event_id);

        res.status(201).json(rsvp || null);
    },

    delete: async (req, res) => {
        const { event_id } = req.params;
        const user_id = req.session.user_id;

        const deletedRsvp = await rsvpModel.delete(user_id, event_id);

        res.status(200).json(deletedRsvp || null);
    },

    listUserRSVPs: async (req, res) => {
        const { user_id } = req.params;
        const events = await rsvpModel.listByUserId(user_id);
        res.status(200).json(events);
    }
};

module.exports = rsvpControllers;
