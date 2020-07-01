import React from 'react';
import { FiMail, FiLock, FiArrowLeft, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';

import * as SC from './styles';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

const SignUp: React.FC = () => {
  function handleSubmit(data: Object): void {
    console.log(data);
  }
  return (
    <SC.Container>
      <SC.Background />

      <SC.Content>
        <img src={logoImg} alt="GoBarber" />

        <Form onSubmit={handleSubmit}>
          <h1>Create your account</h1>

          <Input name="name" icon={FiUser} placeholder="Name" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            name="passord"
            icon={FiLock}
            type="password"
            placeholder="Password"
          />

          <Button type="submit">Create</Button>
        </Form>

        <a href="login">
          <FiArrowLeft />
          Go back to login
        </a>
      </SC.Content>
    </SC.Container>
  );
};

export default SignUp;
