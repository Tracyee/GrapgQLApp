import React from 'react';
import { Button } from '@chakra-ui/react';
import './eventItem.less';

type EventItemProps = {
  eventId: string;
  title: string;
  price: number;
  date: string;
  userId: string;
  creatorId: string | undefined;
  onDetail: (eventId: string) => void;
};

const EventItem = ({
  eventId,
  title,
  price,
  date,
  userId,
  creatorId,
  onDetail,
}: EventItemProps): JSX.Element => (
  <li key={eventId} className="events-list-item">
    <div>
      <h1>{title}</h1>
      <h2>
        ${price} - {new Date(date).toLocaleDateString()}
      </h2>
    </div>
    <div>
      {userId === creatorId ? (
        <p>Your the owner of this event.</p>
      ) : (
        <Button variant="with-shadow" onClick={() => onDetail(eventId)}>
          View Details
        </Button>
        // <button type="button" className="btn" onClick={() => onDetail(eventId)}>
        //   View Details
        // </button>
      )}
    </div>
  </li>
);

export default EventItem;
