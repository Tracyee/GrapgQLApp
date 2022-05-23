import React from 'react';
import useEventModal from '../components/modal/useEventModal';
import './events.less';

const CreateEventButton = (): JSX.Element => {
  const { open, ModalDialog } = useEventModal({ title: 'Create Event' });
  return (
    <>
      <ModalDialog />
      <button type="button" className="btn" onClick={open}>
        Create Event
      </button>
    </>
  );
};

const EventsPage = (): JSX.Element => (
  <div className="events-control">
    <p>Share your own Events!</p>
    <CreateEventButton />
  </div>
);

export default EventsPage;
