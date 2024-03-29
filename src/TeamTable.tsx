import React from 'react';
import { useFluroContext } from './fluroapi/context';
import { ReloadButton } from './fluroapi/ReloadButton';
import { Capability, TeamMember } from './fluroapi/team';


export type CapabilitySlug = 'worshipCapability' | 'worshipproduction' | 'connectionscapability';
export interface CapabilityInfo { slug: CapabilitySlug, name: string}

interface Props {
  capability: CapabilityInfo
}


export const TeamTable = (props: Props) => {
  const fluro = useFluroContext();

  if (!fluro.team?.data) {
    return <ReloadButton {...fluro.team}/>
  }

  const team = fluro.team.data;

  const capabilitiesByTitle: {[key: string]: Capability} = {};
  for (let m of team) {
    for (let c of m.capabilities) {
      if (c.definition === props.capability.slug)
      capabilitiesByTitle[c.title] = c;
    }
  }
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
        {team.filter(m => m.capabilities
            .filter(c => c.definition === props.capability.slug).length > 0)
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