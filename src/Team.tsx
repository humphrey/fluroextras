
import { useApiTeam } from './api/team';
import { TeamTable } from './TeamTable';

interface Props {
}




export const Team = (props: Props) => {
  const team = useApiTeam();
  return (
    <>
      <h5>Worship Team Capabilities</h5>
      {team.team && <TeamTable team={team.team} type="worshipCapability"/>}
      <h5>Production Team Capabilities</h5>
      {team.team && <TeamTable team={team.team} type="worshipproduction"/>}
      <h5>Connection Team Capabilities</h5>
      {team.team && <TeamTable team={team.team} type="connectionscapability"/>}
      <button disabled={team.fetching} onClick={() => team.reload()}>{team.fetching ? 'Loading...' : (team.team ? 'Reload' : 'Load')}</button>
    </>
  )
}