/* eslint-disable no-underscore-dangle */
import React from 'react';

import { Event } from '../../../types/payload';
import EventItem from './eventItem/eventItem';
import './eventList.less';

type EventListProps = {
  events: Event[];
  authUserId: string;
  onViewDetail: (eventId: string) => void;
};

const EventList = ({
  events,
  authUserId,
  onViewDetail,
}: EventListProps): JSX.Element => {
  const eventItems = events?.map(event => (
    <EventItem
      key={event._id}
      eventId={event._id}
      title={event.title}
      price={event.price}
      date={event.date}
      userId={authUserId}
      creatorId={event.creator?._id}
      onDetail={onViewDetail}
    />
  ));

  return <ul className="event-list">{eventItems}</ul>;
};

export default EventList;
