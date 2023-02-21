import React from 'react';
import { Capability, TeamMember } from './fluroapi/team';

interface Props {
  team: TeamMember[]
  type: string
}




export const TeamTable = (props: Props) => {

  const capabilitiesByTitle: {[key: string]: Capability} = {};
  for (let m of props.team) {
    for (let c of m.capabilities) {
      if (c.definition === props.type)
      capabilitiesByTitle[c.title] = c;
    }
  }
  console.log(capabilitiesByTitle)
  const capabilities = Object.values(capabilitiesByTitle).sort((a,b) => a.title.localeCompare(b.title));

  return (
    
    <table className='table table-sm table-bordered table-striped'>
      <thead>
        <tr>
          <td></td>
          {capabilities.map(c => (
            <td key={c.title}>{c.title}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.team.filter(m => m.capabilities
            .filter(c => c.definition === props.type).length > 0)
            .sort((a,b) => a.title.localeCompare(b.title))
            .map(t => (
          <tr key={t._id}>
            <td>{t.title}</td>
            {capabilities.map(c => (
              <th key={c._id}>
                {t.capabilities.filter(mc => mc.title === c.title).length > 0 && '✅'}
              </th>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}