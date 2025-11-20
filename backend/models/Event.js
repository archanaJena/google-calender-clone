import mongoose from 'mongoose';

const calendarColors = ['blue', 'red', 'green', 'orange', 'purple', 'cyan', 'gray'];
const recurrenceFrequencies = ['daily', 'weekly', 'monthly', 'yearly', 'none'];

const recurrenceSchema = new mongoose.Schema(
  {
    frequency: {
      type: String,
      enum: recurrenceFrequencies,
      default: 'none',
    },
    interval: {
      type: Number,
      default: 1,
      min: 1,
    },
    endDate: Date,
    count: Number,
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    calendarId: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      enum: calendarColors,
      default: 'blue',
    },
    location: {
      type: String,
      trim: true,
    },
    guests: [
      {
        type: String,
        trim: true,
      },
    ],
    recurrence: recurrenceSchema,
    timezone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

eventSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;


