import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';

import * as SC from './styles';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';

interface ForgotPasswordFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData): Promise<void> => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email is required')
            .email('Must be a valid email'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        // TODO: Implement password recovery
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        }

        addToast({
          type: 'error',
          title: 'Password recovery fails',
          description: 'Please, verify your data.',
        });
      }
    },
    [addToast],
  );

  return (
    <SC.Container>
      <SC.Content>
        <SC.AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recover your password</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button type="submit">Recover</Button>
          </Form>

          <Link to="/signin">
            <FiLogIn />
            Back to login
          </Link>
        </SC.AnimationContainer>
      </SC.Content>

      <SC.Background />
    </SC.Container>
  );
};

export default ForgotPassword;
