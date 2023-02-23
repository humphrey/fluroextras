import React from 'react';
import { API_URL } from './api';
import { sessionStateKeys, useSessionState } from './sessionState';


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
  permissionSets: {
    [id: string]: {
      _id: string
      title: string
      color: string
      bgColor: string
      definition?: "campus" | string
      children?: {
        "_id": string,
        "_team": string,
        "title": string,
        "definition": string,
        "_discriminator": string,
        "_discriminatorType": string
      }[]
    }
  }
}

interface RefreshTokenPayload {
  token: string
  refreshToken: string
  expires: string
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

export const refreshAuthToken = async (refreshToken: string) => {
  const r = await fetch(API_URL + 'token/refresh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({refreshToken})
  });
  if (!r.ok) return null;
  return await r.json() as unknown as RefreshTokenPayload;
}


export const useFluroAuth = () => {
  const [data, setUser] = useSessionState<LoginPayload>(sessionStateKeys.AUTH);
  const [fetching, setFetching] = React.useState(false);

  const _logout = async () => { 
    setUser(null)
    window.sessionStorage.clear();
  }

  const getAuthHeaders = async (): Promise<HeadersInit | undefined> => {
    if (!data) return {};

    // Is the refresh token expired?
    // if (data.expires.localeCompare(new Date().toISOString()) <= 0) {
      console.log('Auth token expired.  Refreshing...');
      const newAuth = await refreshAuthToken(data.refreshToken);
      if (!newAuth) {
        _logout();
        return undefined;
      }
      setUser({...data, ...newAuth});
      return {Authorization: `Bearer ${newAuth.token}`};
    // }
    // return {Authorization: `Bearer ${data.token}`};

  };

  return {

    data,
    
    fetching,

    getAuthHeaders,

    api: data ? {
      buildGetInit: async () => ({
        method: 'GET',
        headers: await getAuthHeaders(),
      }),
      buildPostInit: async (json: any) => ({
        method: 'POST',
        body:  JSON.stringify(json),
        headers: {
          ...await getAuthHeaders(),
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

    _logout,

  }
};


export type FluroAuth = ReturnType<typeof useFluroAuth>;
