/* eslint-disable no-console */
import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/authContext';
import { Event } from '../../types/payload';
import ModalBase from './baseModal';

interface EventModalType {
  show: boolean;
  ModalDialog: () => JSX.Element;
  open: VoidFunction;
  close: VoidFunction;
}

const useCreateEvent = ({
  modalTitle,
  onSuccess,
}: {
  modalTitle: string;
  onSuccess: (createdEvent: Event) => void;
}): EventModalType => {
  const [show, setShow] = React.useState(false);

  const [isTitleEmpty, setIsTitleEmpty] = React.useState(false);
  const [isPriceEmpty, setIsPriceEmpty] = React.useState(false);
  const [isDateEmpty, setIsDateEmpty] = React.useState(false);

  const auth = useAuth();

  const titleElRef = React.useRef<HTMLInputElement>(null);
  const priceElRef = React.useRef<HTMLInputElement>(null);
  const dateElRef = React.useRef<HTMLInputElement>(null);
  const descriptionElRef = React.useRef<HTMLTextAreaElement>(null);

  const open = () => setShow(true);
  const close = () => setShow(false);

  const handleSubmit: React.FormEventHandler<HTMLButtonElement> = () => {
    setIsTitleEmpty(false);
    setIsPriceEmpty(false);
    setIsDateEmpty(false);

    const title = titleElRef.current?.value;
    const price = Number(priceElRef.current?.value);
    const date = dateElRef.current?.value;
    const description = descriptionElRef.current?.value;

    const invalidTitle = !title || title.trim().length === 0;
    const invalidPrice = !price || price <= 0;
    const invalidDate = !date || date.trim().length === 0;

    if (invalidTitle) {
      setIsTitleEmpty(true);
    }
    if (invalidPrice) {
      setIsPriceEmpty(true);
    }
    if (invalidDate) {
      setIsDateEmpty(true);
    }

    if (invalidTitle || invalidPrice || invalidDate) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $description: String, $price: Float!, $date: String!) {
          createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {              _id
              title
              description
              date
              price
            }
          }
        `,
      variables: {
        title,
        description,
        price,
        date,
      },
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
        onSuccess(resData.data.createEvent as Event);
        setIsTitleEmpty(false);
        setIsPriceEmpty(false);
        setIsDateEmpty(false);
        close();
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
        <FormControl isInvalid={isTitleEmpty} isRequired>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input type="text" id="title" ref={titleElRef} />
          <FormErrorMessage>Title is required</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={isPriceEmpty} isRequired>
          <FormLabel htmlFor="price">Price</FormLabel>
          <NumberInput variant="flushed" precision={2} step={1}>
            <NumberInputField id="price" ref={priceElRef} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>Price is required</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={isDateEmpty} isRequired>
          <FormLabel htmlFor="date">Date</FormLabel>
          <Input type="datetime-local" id="date" ref={dateElRef} />
          <FormErrorMessage>Date is required</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea id="description" rows={4} ref={descriptionElRef} />
        </FormControl>
      </form>
    </ModalBase>
  );

  return { show, ModalDialog, open, close };
};

export default useCreateEvent;
