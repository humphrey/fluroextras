import React from "react"
import { API_URL } from "./api"
import { FluroAuth } from "./auth"
import { sessionStateKeys, useSessionState } from "./sessionState"


export interface Capability {
  _id: string
  _type: string
  title: string
  definition: string
}

export interface Realm {
  _id: string
  _type: 'realm'
  title: string
  definition: string
  color: string
  bgColor: string
}

export interface Tag {
  _id: string
  definition:string
  title: string
  _type: "tag"
}

export interface TeamMember {
  _id: string
  _type: 'contact'
  title: string
  definition: string
  firstName: string
  lastName: string
  gender: string
  capabilities: ReadonlyArray<Capability>
  status: "active" | string
	realms: ReadonlyArray<Realm>
  tags: ReadonlyArray<Tag>
  created: string
  updated: string
}

// {"sort":{"sortKey":"lastName","sortDirection":"asc","sortType":"string"},"filter":{"operator":"and","filters":[{"operator":"and","filters":[{"key":"capabilities|connectionscapability","comparator":null,"values":[],"guid":"1866e53d-10bc-4000-8d2f-e33c1071b800","title":"CONNECTIONS Capability","value":null,"value2":null,"dataType":"reference"},{"guid":"1866e54d-13fe-4000-87bd-e50e60b87000","comparator":">","title":"Age","key":"age","value":"4","value2":null,"values":[],"dataType":"integer"}],"guid":"1866e53d-102e-4000-8c94-ffc529a1d000"}]},"search":"","includeArchived":false,"allDefinitions":true,"searchInheritable":false,"includeUnmatched":true,"timezone":"Australia/Hobart"}
const PAYLOAD = {
  "sort": {
    "sortKey": "lastName",
    "sortDirection": "asc",
    "sortType": "string"
  },
  "filter": {
    "operator": "and",
    "filters": [
      {
        "operator": "or",
        "filters": [
          {
            "guid": "18620bc2-a5d0-4000-8036-1e2eed59f800",
            "comparator": "notempty",
            "title": "WORSHIP Capability",
            "key": "capabilities|worshipCapability",
            "value": null,
            "value2": null,
            "values": [],
            "dataType": "reference"
          },
          {
            "guid": "18620c0e-ad88-4000-82a3-dd0eb4c88000",
            "comparator": "notempty",
            "title": "PRODUCTION Capability",
            "key": "capabilities|worshipproduction",
            "value": null,
            "value2": null,
            "values": [],
            "dataType": "reference"
          },
          {
            "guid":"1866e53d-10bc-4000-8d2f-e33c1071b800",
            "comparator": "notempty",
            "title":"CONNECTIONS Capability",
            "key":"capabilities|connectionscapability",
            "value":null,
            "value2":null,
            "values":[],
            "dataType":"reference"
          }
        ],
        "guid": "18620bbb-31da-4000-899b-30700067a000"
      }
    ]
  },
  "search": "",
  "includeArchived": false,
  "allDefinitions": true,
  "searchInheritable": false,
  "includeUnmatched": false,
  "timezone": "Australia/Hobart",
  "select": [
    "title",
    "firstName", 
    "lastName",
    "gender",
    "capabilities",
    "status",
    "realms",
    "tags",
    "created",
    "updated",
    "unavailability"
  ]
};


export const useFluroTeam = (auth: FluroAuth) => {
  const [data, setData] = useSessionState<TeamMember[]>(sessionStateKeys.TEAM);
  const [fetching, setFetching] = React.useState(false);

  if (auth.api === null) return null;

  const reload = async () => {
    if (auth.api === null) return null;
    setFetching(true);
    const r = await fetch(API_URL + 'content/contact/filter', auth.api.buildPostInit(PAYLOAD));
    if (!r.ok) return null;
    const j = (await r.json() as TeamMember[] | null) ?? [];
    setData(j);
    setFetching(false);
    return j;
  }


  // Auto load team, if hook in use
  // const couldBeLoaded = !fetching && context.team === null && context.auth?.refreshToken;
  // React.useEffect(() => {
  //   if (couldBeLoaded) {
  //     reload();
  //   }
  // }, [couldBeLoaded])

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

export type FluroTeam = ReturnType<typeof useFluroTeam>;
