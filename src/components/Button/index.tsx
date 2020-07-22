import React, { ButtonHTMLAttributes } from 'react';

import * as SC from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <SC.Button type="button" {...rest}>
    {loading ? 'Loading...' : children}
  </SC.Button>
);

export default Button;
