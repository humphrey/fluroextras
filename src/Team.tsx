import { useApi } from './api/context';
import { TeamTable } from './TeamTable';

interface Props {
}




export const Team = (props: Props) => {
  const api = useApi();
  if (!api.team) {
    return <>Loading Team</>
  }
  return (
    <TeamTable team={api.team} type="worshipCapability"/>
  )
}