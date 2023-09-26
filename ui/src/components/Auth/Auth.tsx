import React, { useState, useCallback } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserDataT } from '../../types/types';
import { useAsync } from 'react-use';
import { PermissionDenied } from '../../errors/errors';
import { get, post } from '../../api/api';

export interface AuthContextType {
  user: any;
  onSignIn: (formData: FormData) => void;
  onSignOut: VoidFunction;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDataT>(null!);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { loading } = useAsync(async () => {
    if (isLoggedIn) return;
    let userData;

    try {
      userData = await get(`users/me/`);
    } catch (e) {
      // Catch only the expected error (403), throw any other unexpected case.
      if (!(e instanceof PermissionDenied)) throw e;
      return;
    }
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const onSignIn = useCallback(async (formData: FormData) => {
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    await get(''); // get CSRF token
    await post('auth/login/', data);
    const userData = await get(`users/me/`);

    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const onSignOut = useCallback(async () => {
    await post('auth/logout/', {});

    setUser(null!);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, onSignIn, onSignOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}

export function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export function RequireNoAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
