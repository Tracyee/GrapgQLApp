/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React, { EffectCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Event } from '../../types/payload';
import { useAuth } from '../../contexts/authContext';
import { LocationState } from '../../types/LocationState';
import ModalBase from './baseModal';

interface EventModalType {
  show: boolean;
  ModalDialog: () => JSX.Element;
  open: VoidFunction;
  close: VoidFunction;
}

const useViewEvent = ({
  selectedEvent,
  onSuccess,
}: {
  selectedEvent: Event | undefined;
  onSuccess: EffectCallback;
}): EventModalType => {
  const [show, setShow] = React.useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState: LocationState = { from: location };

  const open = () => setShow(true);
  const close = () => setShow(false);

  const handleBook = () => {
    close();
    if (!auth.token) {
      onSuccess();
      navigate('/', { state: locationState, replace: true });
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: selectedEvent?._id,
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
        onSuccess();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const ModalDialog = () => (
    <>
      {selectedEvent && (
        <ModalBase
          title={selectedEvent.title}
          confirmText={auth.token ? 'Book' : 'Login to book'}
          show={show}
          onClose={close}
          onConfirm={handleBook}
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
