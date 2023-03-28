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


interface RefreshTokenPayload {
  token: string
  refreshToken: string
  expires: string
}

export const fetchRefreshedAccessToken = async (refreshToken: string) => {
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
  };


  const refreshAccessToken = async () => {
    if (!data) return
    const d = await fetchRefreshedAccessToken(data?.refreshToken);
    setUser({...data, ...d})
    return d;
  }

  const getAuthHeaders = async (): Promise<HeadersInit> => {
    if (!data) return {};

    // Is the refresh token expired?
    if (getTimeUntilExpires(data.expires).min <= 2) {  // 5 mins
      console.log('token expired, refreshing...')
      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        await _logout();
        return {};
      }
      return {Authorization: `Bearer ${newAccessToken.token}`};
    }
    return {Authorization: `Bearer ${data.token}`};
  };

  return {

    data,
    
    fetching,

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
      setUser(d ? {
        _id: d._id,
        name: d.name,
        email: d.email,
        firstName: d.firstName,
        lastName: d.lastName,
        token: d.token,
        refreshToken: d.refreshToken,
        expires: d.expires,
        account: {
          _id: d.account._id,
          title: d.account.title,
          shortName: d.account.shortName,
        },
        permissionSets: d.permissionSets,
      } : null);
      setFetching(false);
      return d;
    },

    _logout,

    refreshAccessToken,

  }
};


export type FluroAuth = ReturnType<typeof useFluroAuth>;


export interface TimeUntilExpires {
  msTotal: number,
  min: number,
  sec: number,
}
export const getTimeUntilExpires = (expires: string | null): TimeUntilExpires => {
  if (!expires) return {msTotal: 0, min: 0,  sec: 0};
  const ms = new Date(expires).getTime() - new Date().getTime();
  return {
    msTotal: ms,
    min: Math.floor(ms / 60 / 1000), 
    sec: Math.round((ms / 1000) % 60)
  };
}
