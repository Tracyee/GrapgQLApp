/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import dateToString from '../../helpers/date';
import Event from '../../models/event';
import User from '../../models/user';

export const transformEvent = (event: any): any => ({
  ...event._doc,
  _id: event.id,
  date: dateToString(event._doc.date),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  creator: getUser.bind(this, event._doc.creator),
});

const getEvent = async (eventId: any) => {
  // console.log('calling getEvent');
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getEvents = async (eventIds: any): Promise<any[]> => {
  // console.log('calling getEvents');
  try {
    const foundEvents = await Event.find({ _id: { $in: eventIds } });
    return foundEvents.map(event => transformEvent(event));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getUser = async (userId: any): Promise<any> => {
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

export const transformBooking = (booking: any) => ({
  ...booking._doc,
  _id: booking.id,
  user: getUser.bind(this, booking._doc.user),
  event: getEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});
