/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Booking } from '../../../types/payload';
import './bookingList.less';

const BookingList = ({
  bookings,
  onDelete,
}: {
  bookings: Booking[];
  onDelete: (bookingId: string) => void;
}): JSX.Element => (
  <ul className="bookings-list">
    {bookings.map(booking => (
      <li key={booking._id} className="bookings-item">
        <div className="bookings-item-data">
          {booking.event.title} -{' '}
          {new Date(booking.createdAt).toLocaleDateString()}
        </div>
        <div className="bookings-item-actions">
          <button
            type="button"
            className="btn"
            onClick={() => onDelete(booking._id)}
          >
            Cancel
          </button>
        </div>
      </li>
    ))}
  </ul>
);

export default BookingList;
