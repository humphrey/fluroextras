import { useFluroContext } from './fluroapi/context';
import { addDays } from './fluroapi/eventList';


interface Props {
  type: string
}


export const TeamUnavailability = (props: Props) => {
  const fluro = useFluroContext();
  const team = fluro.team?.data;
  const unavail = fluro.unavailability?.data;

  return (
    <>
      <table className='table table-sm'>
        <tbody>
          {team?.filter(m => m.capabilities.filter(c => c.definition == props.type).length > 0).map(m => (
            <tr key={m._id}>
              <th>{m.title}</th>
              {unavail && unavail[m._id]?.filter(u => u.startDate.localeCompare(addDays(new Date(), -2).toISOString()) > 0 || u.endDate.localeCompare((new Date()).toISOString()) > 0).sort((a,b) => a.startDate.localeCompare(b.startDate)).map(u => (
                <td key={u._id}>
                  {u.startDate.substring(0, 16)}<br/>{u.endDate.substring(0, 16)}<br/>{u.description}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}