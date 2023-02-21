import React from 'react';
import { API_URL } from './api';
import { useSessionState } from './sessionState';


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
  return await r.json() as unknown as LoginPayload;
}


export const useFluroAuth = () => {
  const [data, setUser] = useSessionState<LoginPayload>('fluro-auth');
  const [fetching, setFetching] = React.useState(false);
  const authHeaders = data ? {Authorization: `Bearer ${data.token}`} : null;

  return {

    data,
    
    fetching,

    api: authHeaders ? {
      headers: authHeaders,
      buildPostInit: (json: any) => ({
        method: 'POST',
        body:  JSON.stringify(json),
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
      }),
    } : null,

    login: async (input: LoginInput) => {
      setFetching(true);
      const d = await login(input);
      setUser(d);
      setFetching(false);
      return d;
    },

    logout: async () => { 
      setUser(null)
    },

  }
};


export type FluroAuth = ReturnType<typeof useFluroAuth>;
