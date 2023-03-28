import React from 'react'


export const sessionStateKeys = {
  AUTH: 'fluro-auth',
  EVENT_LIST: 'fluro-eventlist',
  EVENT_DETAILS: 'fluro-eventdetails',
  TEAM: 'fluro-team',
  UNAVAILABILITY: 'fluro-unavailability',
}


export const useSessionState = <T,>(key: string): [T | null, (state: T | null) => void] => {
  // Cache data in session
  const storedData = window.sessionStorage.getItem(key);
  const [state, setState] = React.useState<T | null>(storedData ? JSON.parse(storedData) as T : null);

  return [
    state,
    (state: T | null) => {
      setState(state);
      window.sessionStorage.setItem(key, JSON.stringify(state));
    },
  ];

};

