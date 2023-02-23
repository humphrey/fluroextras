import React from 'react';

export interface ReloadButtonProps {
  data?: any | null
  fetching?: boolean
  reload?: () => Promise<any>
}

export const ReloadButton = (props: ReloadButtonProps) => (
  <button 
    className='btn btn-outline-secondary'
    disabled={props.fetching || !props.reload} 
    onClick={() => props.reload && props.reload()}>
      {props.fetching ? 'Fetching data...' : (props.data ? 'Reload data' : 'Load data')}
  </button>
)