import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

jest.mock('react-router-dom', () => {
  return {
    useHistory: jest.fn(),
    Link: ({ children }: { children: ReactNode }) => children,
  };
});

describe('SignIn page', () => {
  it('should be able to sign in', () => {
    const result = render(<SignIn />);
    const { debug } = result;
    debug();
  });
});
