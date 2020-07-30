import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth Hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user-id',
        name: 'John Doe',
        email: 'johndoe@email.com',
        avatar_url: 'https://api/files/avatar.jpg',
      },
      token: 'user-token',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@email.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.email).toBe('johndoe@email.com');
  });

  it('should set adorable avatar if have no avatar on sign in', async () => {
    const apiResponseWithoutAvatar = {
      user: {
        id: 'user-id',
        name: 'John Doe',
        email: 'johndoe@email.com',
      },
      token: 'user-token',
    };

    apiMock.onPost('sessions').reply(200, apiResponseWithoutAvatar);

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@email.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(result.current.user.avatar_url).toBe(
      'https://api.adorable.io/avatars/100/John Doe.png',
    );
  });

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'user-token';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'John Doe',
            email: 'johndoe@email.com',
            avatar_url: 'https://api.adorable.io/avatars/100/John Doe.png',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toBe('johndoe@email.com');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'user-token';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'John Doe',
            email: 'johndoe@email.com',
            avatar_url: 'https://api.adorable.io/avatars/100/John Doe.png',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'johndoe@email.com',
      avatar_url: 'https://api.adorable.io/avatars/100/John Doe.png',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});
