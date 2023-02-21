import React from 'react';

interface Props {
  data: any | null
  fetching: boolean
  reload: () => Promise<any>
}

export const ReloadButton = (props: Props) => (
  <button disabled={props.fetching} onClick={() => props.reload()}>{props.fetching ? 'Loading...' : (props.data ? 'Reload' : 'Load')}</button>
)