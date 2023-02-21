import React from "react"
import { ApiFetchInfo } from "./config"
import { ApiContext } from "./context"


export interface EventStub {
  _id: string
  _type: string
  title: string
  definition: string
  startDate: string
  endDate: string
}

export const fetchEventList = (): ApiFetchInfo<EventStub[]> => ({
  path: 'content/event/filter', 
  fetch: {
    method: 'POST',
    body: JSON.stringify({
      "startDate": addDays(new Date(), -30),
      "endDate": addDays(new Date(), +90),
      "timezone": "Australia/Hobart",
      "sort": {
        "sortKey": "startDate",
        "sortDirection": "asc", "sortType": "date"
      },
      "filter": {
        "operator": "and",
        "filters": [
          {
            "operator": "and", "filters": [
              { "key": "status", "comparator": "in", "values": ["active", "draft", "archived"] }
            ]
          }]
      },
      "search": "",
      "includeArchived": true,
      "allDefinitions": true,
      "searchInheritable": false,
      "includeUnmatched": true,
      "limit": 50,
    })
  },
  parse: json => json
})

export const addDays = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return date;
}

export interface Track {
  _id: string
  title: string
  status: "archived" | "active" | string
}

export interface EventDetail {
  _id: string
  status: string
  title: string
  definition: string
  startDate: string
  rostered: {
    _id: string
    title: string
    definition: string
    slots: {
        title: string
        minimum: number
        maximum: number
        assignments: {
          _id: string
          status: string
          title: string
          confirmationStatus: string
          contact: {
            _id: string
            firstName: string
            lastName: string
            title: string
          }
          contactName: string
        }[]
      }[]
  }[],
  track: Track | undefined
}


export const useApiEvents = (eventIds: string[]) => {
  const context = React.useContext(ApiContext);
  const [fetching, setFetching] = React.useState(false);

  const reload = async () => {
    setFetching(true);
    const data = await context.authFetch({
      path: 'content/event/multiple', 
      json: {
        "ids": eventIds,
        "select":["title","_type","definition","subject","date","_id","realms","endDate","timezone","startDate","firstLine","status","plans","streamEnabled","publicTicketingEnabled","stats.guestExpected","stats.guestConfirmed","stats.guestDeclined","tickets.value","stats.checkin","headcount.average","track","rooms","locations","updated","created"],
        "populateAll":true,
        "limit": eventIds.length,
        "appendContactDetails":[],
        "appendAssignments":true
      },
    })
    if (data) {
      context.setEvents(data);
      setFetching(false);
      return (data as EventDetail[]).filter(e => e.track?.status === 'active');
    }
    setFetching(false);
    return null;
  }


  // Auto load team, if hook in use
  // const couldBeLoaded = eventIds.length > 0 && !fetching && context.events === null && context.auth?.refreshToken;
  // React.useEffect(() => {
  //   if (couldBeLoaded) {
  //     reload();
  //   }
  // }, [couldBeLoaded])

  return {
    events: context.events,
    reload,
    fetching
  }
};
