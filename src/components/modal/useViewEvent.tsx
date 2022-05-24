/* eslint-disable no-console */
import React from 'react';
import { Event } from '../../types/payload';
import ModalBase from './baseModal';

interface EventModalType {
  show: boolean;
  ModalDialog: () => JSX.Element;
  open: VoidFunction;
  close: VoidFunction;
}

const useViewEvent = ({
  selectedEvent,
}: {
  selectedEvent: Event | undefined;
}): EventModalType => {
  const [show, setShow] = React.useState(false);

  const open = () => setShow(true);
  const close = () => setShow(false);

  const ModalDialog = () => (
    <>
      {selectedEvent && (
        <ModalBase
          title={selectedEvent.title}
          show={show}
          onClose={close}
          onConfirm={() => {}}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{' '}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </ModalBase>
      )}
    </>
  );

  return { show, ModalDialog, open, close };
};

export default useViewEvent;
