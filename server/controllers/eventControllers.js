const eventModel = require('../models/eventModel');

const eventControllers = {

    list: async (req, res) => {
        const events = await eventModel.list();
        res.json(events)
    },

    listByUserId: async (req, res) => {
        const { user_id } = req.params;
        const events = await eventModel.listByUserId(user_id)
        res.json(events);
    },

    create: async (req, res) => {
        const { title, description, date, location, event_type, max_capacity } = req.body;

        if (!title || !date || !location || !event_type || !max_capacity) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user_id = req.session.user_id;
        const event = await eventModel.create({ title, description, date, location, event_type, max_capacity, user_id });
        res.status(201).json(event);
    },

    delete: async (req, res) => {
        const { event_id } = req.params;
        const user_id = req.session.user_id;

        const event = await eventModel.find(event_id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.user_id !== user_id) {
            return res.status(403).json({ message: "You do not own this event" });
        }

        const deletedEvent = await eventModel.delete(event_id);
        res.status(200).json(deletedEvent);
    },

    update: async (req, res) => {
        const { event_id } = req.params;
        const user_id = req.session.user_id;

        const event = await eventModel.find(event_id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.user_id !== user_id) {
            return res.status(403).json({ message: "You do not own this event" });
        }

        const updatedEvent = await eventModel.update(event_id, req.body);
        res.status(200).json(updatedEvent);
    }
};




module.exports = eventControllers;