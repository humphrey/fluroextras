

import React from 'react';
import { getTimeUntilExpires, useFluroAuth } from './fluroapi/auth';
import { useSelectCampuses } from './selectors/campuses';

interface Props {
}


export const AuthInfo = (props: Props) => {
  const auth = useFluroAuth();

  const [min, sec] = useSessionExpiresIn(auth.data?.expires ?? null, 1000)
  const [refreshing, setRefreshing] = React.useState(false);
  return (
    <>
      <li>
        <button 
          className='btn btn-link dropdown-item rounded-0' 
          onClick={async e => {
            e.stopPropagation();
            setRefreshing(true);
            await auth.refreshAccessToken();
            setRefreshing(false);
          }}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing Auth Token' : 'Refresh Auth Token'}<br/><small><code className='small text-muted'>Expires in {min}&nbsp;min&nbsp;{sec.toString().padStart(2, '0')}&nbsp;sec</code></small>
        </button>
      </li>
    </>
  )
}


const useSessionExpiresIn = (expires: string | null, refreshIntervalMs=1000): [number, number] => {
  const [ms, setMs] = React.useState(getTimeUntilExpires(expires));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMs(getTimeUntilExpires(expires))
    }, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [expires]);

  return ms;
}