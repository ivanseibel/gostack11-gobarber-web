import React from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import * as SC from './styles';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

const SignIn: React.FC = () => {
  return (
    <SC.Container>
      <SC.Content>
        <img src={logoImg} alt="GoBarber" />

        <form>
          <h1>Log in to the app</h1>

          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            name="passord"
            icon={FiLock}
            type="password"
            placeholder="Password"
          />

          <Button type="submit">Login</Button>

          <a href="forgot">I forgot my password</a>
        </form>

        <a href="login">
          <FiLogIn />
          Create new account
        </a>
      </SC.Content>

      <SC.Background />
    </SC.Container>
  );
};

export default SignIn;
