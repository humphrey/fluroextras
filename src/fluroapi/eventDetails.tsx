import React from "react"
import { API_URL } from "./api"
import { FluroAuth } from "./auth"
import { EventStub, FluroEventList } from "./eventList"
import { useSessionState } from "./sessionState"


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


export const useFluroEventDetails = (auth: FluroAuth, eventList: FluroEventList) => {
  const [data, setData] = useSessionState<EventDetail[]>('fluro-eventdetails');
  const [fetching, setFetching] = React.useState(false);

  if (auth.api === null || eventList === null) return null;

  const reload = async () => {
    if (auth.api === null || eventList === null) return null;

    setFetching(true);

    const eventIds = (await eventList.getData())?.map(e => e._id) ?? null;

    // let eventListData: EventStub[] | null = eventList.data;

    // if (eventList.data === null) {
    //   if (eventList.fetching) return null;
    //   setFetching(true);
    //   eventListData = await eventList.reload()
    // }
    // const eventIds = eventListData?.map(e => e._id) ?? null;

    if (eventIds === null) {
      setFetching(false);
      return null;
    }
    if (eventIds.length === 0) {
      setData([]);
      setFetching(false);
      return [];
    }
    
    setFetching(true);
    const r = await fetch(API_URL + 'content/event/multiple', auth.api.buildPostInit({
      "ids": eventIds,
      "select":["title","_type","definition","subject","date","_id","realms","endDate","timezone","startDate","firstLine","status","plans","streamEnabled","publicTicketingEnabled","stats.guestExpected","stats.guestConfirmed","stats.guestDeclined","tickets.value","stats.checkin","headcount.average","track","rooms","locations","updated","created"],
      "populateAll":true,
      "limit": eventIds.length,
      "appendContactDetails":[],
      "appendAssignments":true
    }));
    if (!r.ok) return null;
    const j = ((await r.json() as EventDetail[] | null) ?? [])
      .filter(e => e.track?.status === 'active');
    setData(j);
    setFetching(false);
    return j;
  }


  // Auto load team, if hook in use
  // const couldBeLoaded = eventIds.length > 0 && !fetching && context.events === null && context.auth?.refreshToken;
  // React.useEffect(() => {
  //   if (couldBeLoaded) {
  //     reload();
  //   }
  // }, [couldBeLoaded])

  return { data, reload, fetching }
};


export type FluroEventDetails = ReturnType<typeof useFluroEventDetails>;
