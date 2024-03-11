import React, { useState } from 'react';
import { useAuth } from '../components/Auth/Auth';
import { useNavigate } from 'react-router-dom';
import { APIError, BadRequest } from '../errors/errors';
import { useConfig } from '../components/Config/Config.tsx';
import { Login } from '@maykin-ui/admin-ui/templates';
import '@maykin-ui/admin-ui/style';

export default function LoginView() {
  const [error, setError] = useState<APIError>(undefined!);
  const config = useConfig();
  const auth = useAuth();
  const navigate = useNavigate();

  const getOidcLoginUrl = () => {
    const nextUrl = new URL('/', window.location.href);
    return config.oidcLoginUrl + '?next=' + nextUrl.href;
  };

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await auth.onSignIn(data);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err as BadRequest);
    }
  }

  return (
    <Login
      formProps={{
        nonFieldErrors: error?.message,
        fields: [
          {
            autoComplete: 'username',
            autoFocus: true,
            label: 'Gebruikersnaam',
            name: 'username',
            required: true,
          },
          {
            autoComplete: 'current-password',
            label: 'Wachtwoord',
            name: 'password',
            required: true,
            type: 'password',
          },
        ],
        secondaryActions: config.oidcEnabled
          ? [
              {
                href: getOidcLoginUrl(),
                children: 'Inloggen via organisatie',
                size: 'xs',
                variant: 'transparent',
              },
            ]
          : undefined,
        onSubmit: handleLogin,
      }}
    />
  );
}
