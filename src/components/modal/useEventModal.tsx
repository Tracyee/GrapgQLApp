import React from 'react';
import ModalBase from './baseModal';

interface EventModalType {
  show: boolean;
  ModalDialog: () => JSX.Element;
  open: VoidFunction;
  close: VoidFunction;
}

const useEventModal = ({ title }: { title: string }): EventModalType => {
  const [show, setShow] = React.useState(false);

  const open = () => setShow(true);
  const close = () => setShow(false);
  const ModalDialog = () => (
    <ModalBase title={title} show={show} onClose={close} onConfirm={close}>
      <p>Modal Content</p>
    </ModalBase>
  );

  return { show, ModalDialog, open, close };
};

export default useEventModal;
