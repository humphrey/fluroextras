import React from "react"
import { ApiFetchInfo } from "./config"
import { ApiContext } from "./context"


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


export const useApiUnavailability = () => {
  const context = React.useContext(ApiContext);
  const [fetching, setFetching] = React.useState(false);


  const reload = async () => {

    const team = context.team;
    if (team === null) return;

    setFetching(true);
    const responses = await Promise.all(
      team.map(m => context.authFetch({
        path: `contact/${m._id}/unavailability`,
      })) ?? []
    )
    const data: UnavailablityData = {};
    for (let i=0 ; i<team.length ; i++){
      data[team[i]._id] = (responses[i] ?? null) as (UnavailablePeriod[] | null);
    }
    // context.

    context.setUnavailability(data)

    setFetching(false);
    return data;
  }


  // Auto load team, if hook in use
  // const couldBeLoaded = !fetching && context.team === null && context.auth?.refreshToken;
  // React.useEffect(() => {
  //   if (couldBeLoaded) {
  //     reload();
  //   }
  // }, [couldBeLoaded])

  return {
    unavailability: context.unavailability,
    reload,
    fetching
  }
};
