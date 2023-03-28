

import React from 'react';
import { getTimeUntilExpires, TimeUntilExpires, useFluroAuth } from './fluroapi/auth';

interface Props {
}


export const AuthInfo = (props: Props) => {
  const auth = useFluroAuth();

  const {msTotal, min, sec} = useSessionExpiresIn(auth.data?.expires ?? null, 1000)
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
          {refreshing ? 'Refreshing Auth Token' : 'Refresh Auth Token'}
          <br/>
          <small>
            <code className='small text-muted'>
              {msTotal >= 0 
                ? <>Expires in {min}&nbsp;min&nbsp;{sec.toString().padStart(2, '0')}&nbsp;sec</>
                : <>Expired {(0-min)}&nbsp;min&nbsp;{(0-sec).toString().padStart(2, '0')}&nbsp;sec&nbsp;ago</>
              }
            </code>
          </small>
        </button>
      </li>
    </>
  )
}


const useSessionExpiresIn = (expires: string | null, refreshIntervalMs=1000): TimeUntilExpires => {
  const [ms, setMs] = React.useState(getTimeUntilExpires(expires));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMs(getTimeUntilExpires(expires))
    }, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [expires]);

  return ms;
}