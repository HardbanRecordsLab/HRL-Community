import { useEffect, useState } from 'react';

const LOCAL_TOKEN = 'hrl-local-app-token';
const LOCAL_USER: User = {
  id: 'local-community-user',
  email: 'local@hardbanrecordslab.online',
  name: 'Local Community User',
  role: 'admin',
};

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface Session {
  user: User | null;
  token?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

function enableLocalSession() {
  localStorage.setItem('hrl_local_app_auth', LOCAL_TOKEN);
  localStorage.removeItem('hrl_jwt_token');
  document.cookie = 'jwt_token=; Max-Age=0; path=/;';
  document.cookie = 'jwt_token=; Max-Age=0; path=/; domain=.hardbanrecordslab.online;';
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: LOCAL_USER,
    session: { user: LOCAL_USER, token: LOCAL_TOKEN },
    loading: true,
  });

  useEffect(() => {
    enableLocalSession();
    setState({ user: LOCAL_USER, session: { user: LOCAL_USER, token: LOCAL_TOKEN }, loading: false });
  }, []);

  return state;
}

export function redirectToLogin() {
  enableLocalSession();
}

export async function signOut() {
  enableLocalSession();
  return { error: null };
}

export async function signUpWithEmail(_email: string, _password: string) {
  enableLocalSession();
  return { data: { user: LOCAL_USER, session: { user: LOCAL_USER, token: LOCAL_TOKEN } }, error: null };
}

export async function signInWithEmail(_email: string, _password: string) {
  enableLocalSession();
  return { data: { user: LOCAL_USER, session: { user: LOCAL_USER, token: LOCAL_TOKEN } }, error: null };
}

export async function signInWithGoogle() {
  return { data: null, error: { message: 'Google login is disabled for this app.' } };
}

export async function signInWithApple() {
  return { data: null, error: { message: 'Apple login is disabled for this app.' } };
}

export async function resetPassword(_email: string) {
  return { data: null, error: null };
}
