import { ApiFetchInfo } from "./config"


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

export const fetchTeamMembers = (): ApiFetchInfo<TeamMember[]> => {
  return {
    path: 'content/contact/filter', 
    fetch: {
      method: 'POST',
      body: JSON.stringify(PAYLOAD)
    },
    parse: json => json
  }
}
