/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import Event from '../../models/event';
import Booking from '../../models/booking';
import { transformEvent, transformBooking } from './utils';

type BookEventArgType = {
  eventId: string;
};

type CancelBookingArgType = {
  bookingId: string;
};

export default {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => transformBooking(booking));
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  bookEvent: async (args: BookEventArgType) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: '62871f152a043ac46ae54ff9',
        event: fetchedEvent,
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  cancelBooking: async (args: CancelBookingArgType) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking._doc.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
