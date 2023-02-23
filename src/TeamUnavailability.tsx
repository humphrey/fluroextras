import { useFluroContext } from './fluroapi/context';
import cs from 'classnames';


interface Props {
  type: string
}


const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const TeamUnavailability = (props: Props) => {
  const fluro = useFluroContext();
  const team = fluro.team?.data;
  const unavail = fluro.unavailability?.data;

  const today = new Date();
  const dates: Date[] = [];
  for (let i=0; i<90; i++) {
    dates.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i))
  }

  const isBlocked = (contactId: string, date: Date) => {
    if (!unavail) return null;
    const un = unavail[contactId];
    if (!un) return null;
    const dateStr = date.toISOString().substring(0, 10);
    const matches = un.filter(u => 
      u.startDate.substring(0, 10).localeCompare(dateStr) <= 0 &&
      u.endDate.substring(0, 10).localeCompare(dateStr) >= 0
    );
    return matches.length > 0 ? matches : null;
  }

  return (
    <>
      <table className='table table-bordered table-striped table-sm'>
        <thead>
          <tr>
            <td></td>
            {dates.map(d => (
              <td className='text-center small'>
                <div className='small'>{months[d.getUTCMonth()]}</div>
                <div className='fw-bold'>{d.getUTCDate()}</div>
                <div className='small'>{days[d.getUTCDay()]}</div>
              </td>
              ))}
          </tr>
        </thead>
        <tbody>
          {team?.filter(m => m.capabilities.filter(c => c.definition == props.type).length > 0).map(m => (<>
            <tr key={m._id}>
              <th style={{whiteSpace: 'nowrap'}} className='ps-3'>{m.title}</th>
              {dates.map(d => (
                ((b) => (
                  <td className={cs('text-center small',d.getUTCDay() === 0 && 'bg-light' , b && 'bg-secondary text-white')} title={((b ?? []).map(bb => `${bb.description} (${bb.startDate} - ${bb.endDate})`).join('\n\n'))}>
                    {b && d.getUTCDate()}
                  </td>
                ))(isBlocked(m._id, d))
              ))}
            </tr>
            </>))}
        </tbody>
      </table>
    </>
  )
}