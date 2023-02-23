import React from "react"
import { API_URL } from "./api"
import { FluroAuth } from "./auth"
import { sessionStateKeys, useSessionState } from "./sessionState"
import { FluroTeam } from "./team"


export interface UnavailablePeriod {
		"_id": string
		"startDate": string
		"endDate": string
		"description": string
		"contact": string
		"account": string
		"updated": string
		"created": string
}

export interface UnavailablityData {
  [contactId: string]: UnavailablePeriod[] | null
}


export const useFluroUnavailability = (auth: FluroAuth, team: FluroTeam) => {
  const [data, setData] = useSessionState<UnavailablityData>(sessionStateKeys.UNAVAILABILITY);
  const [fetching, setFetching] = React.useState(false);

  if (auth.api === null || team === null) return null;


  const reload = async () => {
    if (auth.api === null) return null;

    setFetching(true);

    const teamData = (await team.getData());

    if (teamData === null) {
      setFetching(false);
      return null;
    }

    if (teamData.length === 0) {
      setData({});
      setFetching(false);
      return null;
    }

    const apiHeaders = await auth.api.buildGetInit();
    if (apiHeaders === null) {
      setFetching(false);
      return null;
    }
    
    const returnedData = await Promise.all(
      teamData.map(async m => {
        if (auth.api === null || apiHeaders === null) return null;
        const url = API_URL + `contact/${m._id}/unavailability`;
        const r = await fetch(url, apiHeaders);
        if (!r.ok) return null;
        const j = (await r.json()) as UnavailablePeriod[] | null;
        if (j === null) return null;
        return {
          contactId: m._id,
          unavailability: j,
        }
      })
    );

    const newData = returnedData.reduce<UnavailablityData>(
      (p, c) => ({
        ...p, 
        ...(c ? {[c.contactId]: c.unavailability} : null),
      })
      , {});

    setData(newData);
    setFetching(false);
    return data;
  }


  return { 
    data, 
    reload, 
    fetching,
    wipe: () => setData(null),
   }
};


export type FluroUnavailability = ReturnType<typeof useFluroUnavailability>;
