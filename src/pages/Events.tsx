import React, { EffectCallback } from 'react';
import useCreateEvent from '../components/modal/useCreateEvent';
import useViewEvent from '../components/modal/useViewEvent';
import EventList from '../components/events/eventList/eventList';
import Spinner from '../components/spinner/spinner';
import { Event } from '../types/payload';
import { useAuth } from '../contexts/authContext';
import './events.less';

const EventsPage = (): JSX.Element => {
  const [events, setEvents] = React.useState<Event[]>(new Array<Event>());
  const [selectedEvent, setSelectedEvent] = React.useState<Event>();
  const [isLoading, setIsLoading] = React.useState(false);
  const auth = useAuth();

  const fetchEvents: EffectCallback = () => {
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  React.useEffect(fetchEvents, []);

  const { open: openCreateEventModal, ModalDialog: CreateEventModal } =
    useCreateEvent({
      modalTitle: 'Create Event',
      onSuccess: (createdEvent: Event) => {
        setEvents([
          ...events,
          { ...createdEvent, creator: { _id: auth.userId } },
        ]);
      },
    });

  const { open: openViewEventModal, ModalDialog: ViewEventModal } =
    useViewEvent({ selectedEvent });

  const viewEventDetailHandler = (eventId: string): void => {
    // eslint-disable-next-line no-underscore-dangle
    setSelectedEvent(events.find(event => event._id === eventId));
    openViewEventModal();
  };

  return (
    <>
      {auth.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <CreateEventModal />
          <button type="button" className="btn" onClick={openCreateEventModal}>
            Create Event
          </button>
        </div>
      )}
      <ViewEventModal />
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={auth.userId}
          onViewDetail={viewEventDetailHandler}
        />
      )}
    </>
  );
};

export default EventsPage;
