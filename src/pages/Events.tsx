/* eslint-disable no-underscore-dangle */
import React, { EffectCallback, useCallback } from 'react';
import { Button } from '@chakra-ui/react';
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

  const fetchEvents: EffectCallback = useCallback(() => {
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
        // eslint-disable-next-line no-console
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  React.useEffect(fetchEvents, [fetchEvents]);

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
    useViewEvent({
      selectedEvent,
      onSuccess: () => setSelectedEvent(undefined),
    });

  const viewEventDetailHandler = (eventId: string): void => {
    // eslint-disable-next-line no-underscore-dangle
    setSelectedEvent(events.find(event => event._id === eventId));
    openViewEventModal();
  };

  return (
    <div className="events-page">
      {auth.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <br />
          <CreateEventModal />
          <Button variant="with-shadow" onClick={openCreateEventModal}>
            Create Event
          </Button>
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
    </div>
  );
};

export default EventsPage;
