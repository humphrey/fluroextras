import React from 'react';
import {ApiFetchInfo, API_URL} from './config';
import { EventDetail, fetchEventDetails, fetchEventList } from './events';
import * as Login from './login';
import { fetchTeamMembers, TeamMember } from './team';



export interface ApiContextData {
  auth: Login.LoginPayload | null
  team: TeamMember[] | null,
  events: EventDetail[] | null,
  login: (input: Login.LoginInput) => Promise<void>
  logout: () => void
  updateAllData: () => Promise<void>,
}

export const ApiContext = React.createContext<ApiContextData>({
  auth: null,
  team: null,
  events: null,
  login: async input => undefined,
  logout: () => undefined,
  updateAllData: async () => undefined,
});


export const useApiState = (): ApiContextData => {
  const [auth, setAuth] = React.useState<Login.LoginPayload | null>(null)
  const [team, setTeam] = React.useState<TeamMember[] | null>(null)
  const [events, setEvents] = React.useState<EventDetail[] | null>(null)

  const authFetch = async <T extends any>(info: ApiFetchInfo<T>) => {
    if (!auth) return null;

    const f = {
      ...info.fetch,
      headers: {
        ...info.fetch.headers, 
        Authorization: `Bearer ${auth.token}`,
        ...info.fetch.body ? {'Content-Type': 'application/json'} : null
      }
    };
    
    // if (info.fetch.body) {
    //   f.headers = {...info.fetch.headers, 'Content-Type': 'application/json'}
    // }
    const r = await fetch(API_URL + info.path, f);
    if (!r.ok) return null;
    const j = await r.json();
    return info.parse(j);
  }


  const updateAllData = async () => {
    await Promise.all([

      authFetch(fetchEventList())
          .then(d => authFetch(fetchEventDetails(d?.map( e => e._id) ?? [])))
          .then(d => setEvents(d)),

      authFetch(fetchTeamMembers())
          .then(d => setTeam(d))
    ])
  }

  return {
    auth,
    team,
    events,
    login: async (input: Login.LoginInput) => {
      const d = await Login.login(input);
      if (!d) return;
      setAuth(d)
      await updateAllData();
    },
    logout: () => { 
      setAuth(null)
    },
    updateAllData,
    

  };
}

export const useApi = (): ApiContextData => {
  const context = React.useContext(ApiContext);
  return context;
}