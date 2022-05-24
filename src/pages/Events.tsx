import React, { EffectCallback } from 'react';
import useEventModal from '../components/modal/useEventModal';
import { Event } from '../types/payload';
import { useAuth } from '../contexts/authContext';
import './events.less';

const EventsPage = (): JSX.Element => {
  const [events, setEvents] = React.useState<Event[]>();
  const auth = useAuth();

  const fetchEvents: EffectCallback = () => {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
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
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        setEvents(resData.data.events);
      })
      .catch(err => {
        console.log(err);
      });
  };

  React.useEffect(fetchEvents, []);

  const eventList = events?.map(event => (
    // eslint-disable-next-line no-underscore-dangle
    <li key={event._id} className="events-list-item">
      {event.title}
    </li>
  ));

  const { open, ModalDialog } = useEventModal({
    modalTitle: 'Create Event',
    onSuccess: fetchEvents,
  });

  return (
    <>
      {auth.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <ModalDialog />
          <button type="button" className="btn" onClick={open}>
            Create Event
          </button>
        </div>
      )}
      <ul className="events-list">{eventList}</ul>
    </>
  );
};

export default EventsPage;
