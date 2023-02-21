import React from 'react';
import {API_URL} from './config';
import { ApiContext } from './context';


// Login
export interface LoginInput {
  username: string
  password: string
}
export interface LoginPayload {
  _id: string
  name: string
  email: string
  firstName: string
  lastName: string
  token: string
  refreshToken: string
  expires: string
  account: {
    _id: string
    title: string
    shortName: string
  }
}
export const login = async (input: LoginInput) => {
  const r = await fetch(API_URL + 'token/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });
  if (!r.ok) return null;
  return r.json() as unknown as LoginPayload;
}


export const useApiLogin = () => {
  const context = React.useContext(ApiContext);
  const [fetching, setFetching] = React.useState(false);
  return {
    user: context.auth,
    login: async (input: LoginInput) => {
      setFetching(true);
      const d = await login(input);
      if (!d) return;
      context.setAuth(d)
      setFetching(false);
      return d;
    },
    logout: async () => { 
      context.setAuth(null)
    },
    fetching
  }
};
