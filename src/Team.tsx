

import { useFluroContext } from './fluroapi/context';
import { TeamTable } from './TeamTable';

interface Props {
}


export const Team = (props: Props) => {
  const fluro = useFluroContext();
  const data = fluro.team?.data;
  return (
    <>
      <h6>Worship Team Capabilities</h6>
      {data && <TeamTable team={data} type="worshipCapability"/>}
      <h6>Production Team Capabilities</h6>
      {data && <TeamTable team={data} type="worshipproduction"/>}
      <h6>Connection Team Capabilities</h6>
      {data && <TeamTable team={data} type="connectionscapability"/>}
    </>
  )
}