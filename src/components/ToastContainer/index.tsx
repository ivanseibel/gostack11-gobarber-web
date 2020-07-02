import React from 'react';
import { FiAlertCircle, FiXCircle } from 'react-icons/fi';
import { useTransition } from 'react-spring';

import { Container } from './styles';
import { ToastMessage, useToast } from '../../hooks/toast';
import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransition = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
    },
  );

  return (
    <Container>
      {messagesWithTransition.map(({ item, key, props }) => (
        <Toast message={item} key={key} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
