import express from 'express';
import Event from '../models/Event.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

const parseDate = (value, label) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const error = new Error(`Invalid ${label} date`);
    error.status = 400;
    throw error;
  }
  return date;
};

// GET /api/events?start=...&end=...
router.get('/', async (req, res, next) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        message: 'Start and end query parameters are required',
      });
    }

    const startDate = parseDate(start, 'start');
    const endDate = parseDate(end, 'end');

    const events = await Event.find({
      user: req.user._id,
      start: { $lte: endDate },
      end: { $gte: startDate },
    }).sort({ start: 1 });

    res.json({ events });
  } catch (error) {
    next(error);
  }
});

// GET /api/events/search?q=...
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Query parameter q is required' });
    }

    const regex = new RegExp(q, 'i');
    const events = await Event.find({
      user: req.user._id,
      $or: [{ title: regex }, { description: regex }, { location: regex }],
    }).sort({ start: 1 });

    res.json({ events });
  } catch (error) {
    next(error);
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    next(error);
  }
});

// POST /api/events
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      description,
      start,
      end,
      allDay = false,
      calendarId,
      color = 'blue',
      location,
      guests = [],
      recurrence,
      timezone,
    } = req.body;

    if (!title || !start || !end || !calendarId) {
      return res.status(400).json({
        message: 'Title, start, end, and calendarId are required',
      });
    }

    const event = await Event.create({
      user: req.user._id,
      title,
      description,
      start: parseDate(start, 'start'),
      end: parseDate(end, 'end'),
      allDay,
      calendarId,
      color,
      location,
      guests,
      recurrence,
      timezone,
    });

    res.status(201).json({ event });
  } catch (error) {
    next(error);
  }
});

// PUT /api/events/:id
router.put('/:id', async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.start) {
      updates.start = parseDate(updates.start, 'start');
    }
    if (updates.end) {
      updates.end = parseDate(updates.end, 'end');
    }

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/events/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;


