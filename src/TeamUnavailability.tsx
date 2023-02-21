import React from 'react';
import { addDays } from './api/events';
import { Capability, TeamMember, useApiTeam } from './api/team';
import { useApiUnavailability } from './api/unavailability';


interface Props {
  type: string
}





export const TeamUnavailability = (props: Props) => {

  const team = useApiTeam();
  const unavail = useApiUnavailability();

  return (
    <>
      <table className='table table-sm'>
        <tbody>
          {team.team?.filter(m => m.capabilities.filter(c => c.definition == props.type).length > 0).map(m => (
            <tr key={m._id}>
              <th>{m.title}</th>
              {unavail.unavailability ? unavail.unavailability[m._id]?.filter(u => u.startDate.localeCompare(addDays(new Date(), -2).toISOString()) > 0 || u.endDate.localeCompare((new Date()).toISOString()) > 0).sort((a,b) => a.startDate.localeCompare(b.startDate)).map(u => (
                <td key={u._id}>
                  {u.startDate}<br/>{u.endDate}<br/>{u.description}
                </td>
              )) : '-'}
            </tr>
          ))}
        </tbody>
      </table>
      <button disabled={unavail.fetching} onClick={() => unavail.reload()}>{unavail.fetching ? 'Loading...' : (unavail.unavailability ? 'Reload' : 'Load')}</button>
    </>
  )
}