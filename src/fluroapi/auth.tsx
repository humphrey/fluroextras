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
  const [data, setUser] = useSessionState<LoginPayload>(sessionStateKeys.AUTH);
  const [fetching, setFetching] = React.useState(false);

  const _logout = async () => { 
    setUser(null)
    window.sessionStorage.clear();
  };

  const getAuthHeaders = (): HeadersInit => {
    if (!data) return {};

    // Is the refresh token expired?
    if (data.expires.localeCompare(new Date().toISOString()) <= 0) {
      console.log('token expired')
      _logout();
      return {};
    }

    return {Authorization: `Bearer ${data.token}`};
  };

  return {

    data,
    
    fetching,

    api: data ? {
      buildGetInit: () => ({
        method: 'GET',
        headers: getAuthHeaders(),
      }),
      buildPostInit: (json: any) => ({
        method: 'POST',
        body:  JSON.stringify(json),
        headers: {
          ...getAuthHeaders(),
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
