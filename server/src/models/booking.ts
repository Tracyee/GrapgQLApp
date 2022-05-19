import { model, Schema } from 'mongoose';

const bookingSchema: Schema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default model('Booking', bookingSchema);
