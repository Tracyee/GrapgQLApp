/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { EffectCallback, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { Booking } from '../types/payload';
import BookingList from '../components/bookings/bookingList/bookingList';
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

  const deleteBooking = useCallback(
    (bookingId: string) => {
      setIsLoading(true);
      const requestBody = {
        query: `
          mutation CancelBooking($bookingId: ID!) {
            cancelBooking(bookingId: $bookingId) {
              _id
              title
            }
          }
        `,
        variables: {
          bookingId,
        },
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
          console.log(resData);
          setBookings(bookings.filter(booking => booking._id !== bookingId));
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });
    },
    [auth.token, bookings],
  );

  useEffect(fetchBookings, [fetchBookings]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBooking} />
      )}
    </>
  );
};

export default BookingsPage;
