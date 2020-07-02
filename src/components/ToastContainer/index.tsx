import React from 'react';
import { FiAlertCircle, FiXCircle } from 'react-icons/fi';

import { Container } from './styles';
import { ToastMessage, useToast } from '../../hooks/toast';
import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  return (
    <Container>
      {messages.map(message => (
        <Toast message={message} key={message.id} />
      ))}
    </Container>
  );
};

export default ToastContainer;
