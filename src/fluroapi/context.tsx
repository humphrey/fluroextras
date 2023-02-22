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


export const ApiContext = React.createContext<FluroApiContextData>({
  auth: {data: null, fetching: false, api: null, login: async () => null, logout: async () => {}},
  team: null,
  eventList: null,
  eventDetails: null,
  unavailability: null,
});


export const useFluroContext = (): FluroApiContextData => {
  const context = React.useContext(ApiContext);
  return context;
}