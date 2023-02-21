import React from 'react';
import { FluroEventList, useFluroEventList } from './eventList';
import { FluroAuth, useFluroAuth } from './auth';
import { FluroEventDetails, useFluroEventDetails } from './eventDetails';
import { FluroTeam, useFluroTeam } from './team';
import { FluroUnavailability, useFluroUnavailability } from './unavailability';



export const useFluroApiState = () => {
  const auth = useFluroAuth() as FluroAuth;
  const team = useFluroTeam(auth) as FluroTeam;
  const eventList = useFluroEventList(auth) as FluroEventList;
  const eventDetails = useFluroEventDetails(auth, eventList) as FluroEventDetails;
  const unavailability = useFluroUnavailability(auth, team) as FluroUnavailability;
  return {
    auth,
    team,
    eventList,
    eventDetails,
    unavailability,
  };
}

type FluroApiContextData = ReturnType<typeof useFluroApiState>

// const defaultApiDate = {
//   data: null,
//   reload: () => null,
//   fetching: false,
//   getData: async () => null,
// }

export const ApiContext = React.createContext<FluroApiContextData>({
  auth: {data: null, fetching: false, api: null, login: async () => null, logout: async () => {}},
  team: null,
  eventList: null,
  eventDetails: null,
  unavailability: null,
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


export const useFluroContext = (): FluroApiContextData => {
  const context = React.useContext(ApiContext);
  return context;
}