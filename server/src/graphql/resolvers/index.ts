/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
import Event from '../../models/event';
import User from '../../models/user';

type CreateEventArgType = {
  eventInput: {
    title: string;
    description: string;
    price: number;
    date: string;
  };
};

type CreateUserArgType = {
  userInput: { email: string; password: string };
};

const getEvents = async (eventIds: any) => {
  // console.log('calling getEvents');
  try {
    const foundEvents = await Event.find({ _id: { $in: eventIds } });
    foundEvents.map(event => ({
      ...event._doc,
      _id: event.id,
      date: new Date(event._doc.date).toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      creator: getUser.bind(this, event._doc.creator),
    }));
    return foundEvents;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getUser = async (userId: any) => {
  // console.log('calling getUser');
  try {
    const foundUser = await User.findById(userId);
    return {
      ...foundUser._doc,
      _id: foundUser.id,
      createdEvents: getEvents.bind(this, foundUser._doc.createdEvents),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => ({
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: getUser.bind(this, event._doc.creator),
      }));
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createEvent: async (args: CreateEventArgType) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '6280849465662c5b31dc5d21',
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: getUser.bind(this, result._doc.creator),
      };
      const creator = await User.findById('6280849465662c5b31dc5d21');
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async (args: CreateUserArgType) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await newUser.save();
      console.log(result);
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
