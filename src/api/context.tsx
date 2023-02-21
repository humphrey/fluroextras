import React from 'react';
import {ApiFetchInfo, API_URL} from './config';
import { EventDetail } from './events';
import * as Login from './login';
import { TeamMember } from './team';
import { UnavailablePeriod, UnavailablityData } from './unavailability';


interface AuthFetchInfo {
  path: string
  json?: any
}


export const useApiStore = () => {
  const [auth, setAuth] = React.useState<Login.LoginPayload | null>(null)
  const [team, setTeam] = React.useState<TeamMember[] | null>(null)
  const [events, setEvents] = React.useState<EventDetail[] | null>(null)
  const [unavailability, setUnavailability] = React.useState<UnavailablityData | null>(null)


  const authFetch = async (info: AuthFetchInfo) => {
    if (!auth) return null;

    const r = await fetch(API_URL + info.path, {

      headers: {
        Authorization: `Bearer ${auth.token}`,
        ...info.json ? {'Content-Type': 'application/json'} : null
      },
      method: info.json ? 'POST' : 'GET',
      body: info.json ? JSON.stringify(info.json) : undefined,
    });
    if (!r.ok) return null;
    return await r.json();
  }


  // const updateAllData = async () => {
  //   await Promise.all([

  //     authFetch(fetchEventList())
  //         .then(d => authFetch(fetchEventDetails(d?.map( e => e._id) ?? [])))
  //         .then(d => setEvents(d)),

  //     authFetch(fetchTeamMembers())
  //         .then(d => setTeam(d))
  //   ])
  // }

  return {
    auth,
    team,
    events,
    unavailability,
    setAuth,
    setTeam,
    setEvents,
    setUnavailability,
    authFetch,
  };
}

type ApiContextData = ReturnType<typeof useApiStore>


// export interface ApiContextData {
//   auth: Login.LoginPayload | null
//   setAuth: (data: Login.LoginPayload | null) => undefined
//   team: TeamMember[] | null,
//   setTeam: (data: TeamMember[] | null) => undefined
//   events: EventDetail[] | null,
//   setEvents: (data: EventDetail[] | null) => undefined,
//   requestHeaders: {[headerName: string]: string}
// }

export const ApiContext = React.createContext<ApiContextData>({
  auth: null,
  team: null,
  events: null,
  unavailability: null,
  setAuth: () => undefined,
  setTeam: () => undefined,
  setEvents: () => undefined,
  setUnavailability: () => undefined,
  authFetch: async () => null,
});


// export const useApiState = (): ApiContextData => {
//   const [auth, setAuth] = React.useState<Login.LoginPayload | null>(null)
//   const [team, setTeam] = React.useState<TeamMember[] | null>(null)
//   const [events, setEvents] = React.useState<EventDetail[] | null>(null)

//   const authFetch = async <T extends any>(info: ApiFetchInfo<T>) => {
//     if (!auth) return null;

//     const f = {
//       ...info.fetch,
//       headers: {
//         ...info.fetch.headers, 
//         Authorization: `Bearer ${auth.token}`,
//         ...info.fetch.body ? {'Content-Type': 'application/json'} : null
//       }
//     };
    
//     // if (info.fetch.body) {
//     //   f.headers = {...info.fetch.headers, 'Content-Type': 'application/json'}
//     // }
//     const r = await fetch(API_URL + info.path, f);
//     if (!r.ok) return null;
//     const j = await r.json();
//     return info.parse(j);
//   }


//   const updateAllData = async () => {
//     await Promise.all([

//       authFetch(fetchEventList())
//           .then(d => authFetch(fetchEventDetails(d?.map( e => e._id) ?? [])))
//           .then(d => setEvents(d)),

//       authFetch(fetchTeamMembers())
//           .then(d => setTeam(d))
//     ])
//   }

//   return {
//     auth,
//     team,
//     events,
//     login: async (input: Login.LoginInput) => {
//       const d = await Login.login(input);
//       if (!d) return;
//       setAuth(d)
//       await updateAllData();
//     },
//     logout: () => { 
//       setAuth(null)
//     },
//     updateAllData,
    

//   };
// }


// export const useApiCon = (): ApiContextData => {
//   const context = React.useContext(ApiContext);
//   return context;
// }