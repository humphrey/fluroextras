

import { useFluroContext } from './fluroapi/context';
import { TeamTable } from './TeamTable';

interface Props {
}



export const Team = (props: Props) => {
  const fluro = useFluroContext();
  console.log('team:', fluro.team)
  const data = fluro.team?.data;
  return (
    <>
      {/* <h5>Capabilities <button disabled={fluro.team?.fetching} onClick={() => fluro.team?.reload()}>{fluro.team?.fetching ? 'Loading...' : (fluro.team?.data ? 'Reload' : 'Load')}</button></h5> */}
      
      <h6>Worship Team Capabilities</h6>
      {data && <TeamTable team={data} type="worshipCapability"/>}
      <h6>Production Team Capabilities</h6>
      {data && <TeamTable team={data} type="worshipproduction"/>}
      <h6>Connection Team Capabilities</h6>
      {data && <TeamTable team={data} type="connectionscapability"/>}
    </>
  )
}