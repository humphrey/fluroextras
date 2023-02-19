import React from 'react';
import { Capability, TeamMember } from './api/team';

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
    
    <table className='table table-bordered table-striped'>
      <thead>
        <tr>
          <th></th>
          {capabilities.map(c => (
            <th key={c.title}>{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.team.filter(m => m.capabilities
            .filter(c => c.definition === props.type).length > 0)
            .sort((a,b) => a.title.localeCompare(b.title))
            .map(t => (
          <tr key={t._id}>
            <th>{t.title}</th>
            {capabilities.map(c => (
              <th>
                {t.capabilities.filter(mc => mc.title === c.title).length > 0 && '✅'}
              </th>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}