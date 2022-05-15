import { model, Schema } from 'mongoose';

const eventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  // { timestamps: true },
);

export default model('Event', eventSchema);
