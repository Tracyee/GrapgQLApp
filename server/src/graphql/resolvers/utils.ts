/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import DataLoader from 'dataloader';
import dateToString from '../../helpers/date';
import Event from '../../models/event';
import User from '../../models/user';

const userLoader = new DataLoader(async (userIds: any) => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    return users;
  } catch (err) {
    console.log(err);
    throw err;
  }
});

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const eventLoader = new DataLoader(eventIds => getEvents(eventIds));

export const transformEvent = (event: any): any => ({
  ...event._doc,
  _id: event.id,
  date: dateToString(event._doc.date),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  creator: getUser.bind(this, event._doc.creator),
});

const getEvent = async (eventId: any) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getEvents = async (eventIds: any): Promise<any[]> => {
  try {
    const foundEvents = await Event.find({ _id: { $in: eventIds } });
    return foundEvents.map(event => transformEvent(event));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getUser = async (userId: any): Promise<any> => {
  try {
    const foundUser = await userLoader.load(userId.toString());
    return {
      ...foundUser._doc,
      _id: foundUser.id,
      createdEvents: () => eventLoader.loadMany(foundUser._doc.createdEvents),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const transformBooking = (booking: any) => ({
  ...booking._doc,
  _id: booking.id,
  user: getUser.bind(this, booking._doc.user),
  event: getEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});
