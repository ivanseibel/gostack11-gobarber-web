import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';

import * as SC from './styles';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData): Promise<void> => {
      const { email } = data;
      formRef.current?.setErrors({});
      try {
        setLoading(true);
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email is required')
            .email('Must be a valid email'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email,
        });

        addToast({
          type: 'success',
          title: 'Recovery password',
          description:
            'A password recovery email has been sent to you, check your inbox',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        }

        addToast({
          type: 'error',
          title: 'Password recovery fails',
          description: 'Please, verify if your email is correct.',
        });
      } finally {
        setLoading(false);
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
            <h1>Recover your password</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recover
            </Button>
          </Form>

          <Link to="/">
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
