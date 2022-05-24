/* eslint-disable no-console */
import React, { EffectCallback } from 'react';
import { useAuth } from '../../contexts/authContext';
import ModalBase from './baseModal';

interface EventModalType {
  show: boolean;
  ModalDialog: () => JSX.Element;
  open: VoidFunction;
  close: VoidFunction;
}

const useEventModal = ({
  modalTitle,
  onSuccess,
}: {
  modalTitle: string;
  onSuccess: EffectCallback;
}): EventModalType => {
  const [show, setShow] = React.useState(false);
  const auth = useAuth();

  const titleElRef = React.useRef<HTMLInputElement>(null);
  const priceElRef = React.useRef<HTMLInputElement>(null);
  const dateElRef = React.useRef<HTMLInputElement>(null);
  const descriptionElRef = React.useRef<HTMLTextAreaElement>(null);

  const open = () => setShow(true);
  const close = () => setShow(false);

  const handleSubmit: React.FormEventHandler<HTMLButtonElement> = () => {
    setShow(false);
    const title = titleElRef.current?.value;
    const price = priceElRef.current?.valueAsNumber;
    const date = dateElRef.current?.value;
    const description = descriptionElRef.current?.value;

    if (
      (title && title.trim().length === 0) ||
      (price && price <= 0) ||
      (date && date.trim().length === 0) ||
      (description && description.trim().length === 0)
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
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

    const { token } = auth;

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Tracy ${token}`,
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
    <ModalBase
      title={modalTitle}
      show={show}
      onClose={close}
      onConfirm={handleSubmit}
    >
      <form>
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" ref={titleElRef} />
        </div>
        <div className="form-control">
          <label htmlFor="price">Price</label>
          <input type="number" id="price" ref={priceElRef} />
        </div>
        <div className="form-control">
          <label htmlFor="date">Date</label>
          <input type="datetime-local" id="date" ref={dateElRef} />
        </div>
        <div className="form-control">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={4} ref={descriptionElRef} />
        </div>
      </form>
    </ModalBase>
  );

  return { show, ModalDialog, open, close };
};

export default useEventModal;
