import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';

import * as SC from './styles';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData): Promise<void> => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          password: Yup.string().required('Password is required'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Passwords must match',
          ),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        // TODO: Implement password reset

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        }

        addToast({
          type: 'error',
          title: 'Password reset fails',
          description: 'Verify your data and try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <SC.Container>
      <SC.Content>
        <SC.AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset your password</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="New password"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirm new password"
            />

            <Button type="submit">Confirm</Button>
          </Form>
        </SC.AnimationContainer>
      </SC.Content>

      <SC.Background />
    </SC.Container>
  );
};

export default ResetPassword;
