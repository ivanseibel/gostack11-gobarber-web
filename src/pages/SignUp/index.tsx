import React, { useCallback, useRef } from 'react';
import { FiMail, FiLock, FiArrowLeft, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import * as SC from './styles';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(async (data: SignUpFormData): Promise<
    void
  > => {
    formRef.current?.setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
          .required('Email is required')
          .email('Must be a valid email'),
        password: Yup.string().min(6, 'Min 6 characters'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('users', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      history.push('/');

      addToast({
        title: 'Well done',
        description: 'You are registered on GoBarber and ready to logon.',
        type: 'success',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
      }

      addToast({
        type: 'error',
        title: 'Oh-oh.. there is something wrong',
        description: 'Please, verify your data and try again.',
      });
    }
  }, []);

  return (
    <SC.Container>
      <SC.Background />

      <SC.Content>
        <SC.AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Create your account</h1>

            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Button type="submit">Create</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Go back to login
          </Link>
        </SC.AnimationContainer>
      </SC.Content>
    </SC.Container>
  );
};

export default SignUp;
