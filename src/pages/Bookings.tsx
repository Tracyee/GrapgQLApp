import React, { EffectCallback, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { Booking } from '../types/payload';
import Spinner from '../components/spinner/spinner';

const BookingsPage = (): JSX.Element => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [bookings, setBookings] = React.useState<Booking[]>(
    new Array<Booking>(),
  );
  const auth = useAuth();

  const fetchBookings: EffectCallback = useCallback(() => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               date
             }
            }
          }
        `,
    };

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Tracy ${auth.token}`,
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        setBookings(resData.data.bookings);
        setIsLoading(false);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        setIsLoading(false);
      });
  }, [auth.token]);

  useEffect(fetchBookings, [fetchBookings]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul>
          {bookings.map(booking => (
            // eslint-disable-next-line no-underscore-dangle
            <li key={booking._id}>
              {booking.event.title} -{' '}
              {new Date(booking.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default BookingsPage;
