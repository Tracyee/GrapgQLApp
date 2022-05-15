import { model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
});

export default model('User', userSchema);
