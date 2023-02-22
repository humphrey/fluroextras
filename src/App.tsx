import React from 'react';
import { ApiContext, useFluroApiState } from './fluroapi/context';
import { LoginForm } from './LoginForm';
import { Campuses } from './Campuses';
import { ReloadButton } from './fluroapi/ReloadButton';
import { Roster } from './Roster';
import { TeamUnavailability } from './TeamUnavailability';
import cs from 'classnames';
import { TeamTable } from './TeamTable';



const capabilities = ['worshipCapability', 'worshipproduction', 'connectionscapability'];

type Section = 'Team' | 'Roster' | 'Unavailability';
const sections: ReadonlyArray<Section> = ['Team', 'Roster', 'Unavailability'];


export const App = () => {
  const fluro = useFluroApiState()
  const [section, setSection] = React.useState<Section>('Team')
  const [capability, setCapability] = React.useState(capabilities[0])
  return (
    <ApiContext.Provider value={fluro}>
      {fluro.auth.api ? <>
        <div className='bg-dark text-white mb-2 d-flex align-items-center'>
          <div className='p-3 me-auto'>Simple Fluro Schedular</div>
          <div className='p-3'>{fluro.auth.data?.firstName}</div>
          {fluro.auth.data && <button className='btn btn-dark' onClick={() => fluro.auth.logout()}>Logout</button>}
        </div>

        <div className='container-fluid'>

          <div className='d-flex justify-content-between mb-3'>

            <div className='btn-group' role="group">
              {sections.map(s => (
                <button key={s} type="button" 
                  className={cs('btn btn-outline-primary', s == section && 'active')}
                  onClick={() => setSection(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className='btn-group' role="group">
              {capabilities.map(c => (
                <button key={c} type="button" 
                  className={cs('btn btn-outline-primary', c == capability && 'active')}
                  onClick={() => setCapability(c)}
                >
                  {c}
                </button>
              ))}
            </div>

          </div>

          {section === 'Team' && fluro.team?.reload && <>
            <h5>Team <ReloadButton {...fluro.team}/></h5>
            <TeamTable capability={capability}/>
          </>}

        </div>

        {section === 'Roster' && fluro.eventDetails?.reload && <>
          <h5>Team Roster <ReloadButton {...fluro.eventDetails}/></h5>
          <Roster/>
        </>}

        {section === 'Unavailability' && fluro.unavailability?.reload && <>
          <h5>Unavailability <ReloadButton {...fluro.unavailability}/></h5>
          <TeamUnavailability type={capability}/>
        </>}
        <Campuses/>

      </> : 
      <LoginForm/>}

    </ApiContext.Provider>
  );
}
