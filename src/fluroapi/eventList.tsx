import React from "react"
import { API_URL } from "./api"
import { FluroAuth } from "./auth"
import { useSessionState } from "./sessionState"


export interface EventStub {
  _id: string
  _type: string
  title: string
  definition: string
  startDate: string
  endDate: string
}

export const addDays = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return date;
}


export const useFluroEventList = (auth: FluroAuth) => {
  const [data, setData] = useSessionState<EventStub[]>('fluro-eventlist');
  const [fetching, setFetching] = React.useState(false);

  if (auth.api === null) return null;

  const reload = async () => {
    if (auth.api === null) return null;
    setFetching(true);
    const r = await fetch(API_URL + 'content/event/filter', auth.api.buildPostInit({
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
    }));
    if (!r.ok) return null;
    const j = (await r.json() as EventStub[] | null) ?? [];
    setData(j);
    setFetching(false);
    return j;
  }

  return {
    data,
    reload,
    fetching,
    getData: async (opts?: {noCache?: boolean}) => {
      if (data === null || opts?.noCache) {
        return await reload();
      }
      return data;
    },
  }
};


export type FluroEventList = ReturnType<typeof useFluroEventList>
