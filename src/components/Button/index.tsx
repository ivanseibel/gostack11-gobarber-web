import React, { ButtonHTMLAttributes } from 'react';

import * as SC from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <SC.Button type="button" {...rest}>
    {children}
  </SC.Button>
);

export default Button;
