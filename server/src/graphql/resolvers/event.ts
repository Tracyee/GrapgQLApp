/* eslint-disable no-console */
import Event from '../../models/event';
import User from '../../models/user';
import { transformEvent } from './utils';

type CreateEventArgType = {
  eventInput: {
    title: string;
    description: string;
    price: number;
    date: string;
  };
};

export default {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => transformEvent(event));
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createEvent: async (args: CreateEventArgType, req: any) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '62871f152a043ac46ae54ff9',
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById('62871f152a043ac46ae54ff9');
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
};
