import cs from 'classnames';
import React from 'react';
import { AuthInfo } from './AuthInfo';
import { ApiContext, useFluroApiState } from './fluroapi/context';
import { LoginForm } from './LoginForm';
import { Roster } from './Roster';
import { SectionHeading } from './SectionHeading';
import { CapabilityInfo, CapabilitySlug, TeamTable } from './TeamTable';
import { TeamUnavailability } from './TeamUnavailability';


const capabilities: CapabilityInfo[] = [
  {slug: 'worshipCapability', name: 'Worship'}, 
  {slug: 'worshipproduction', name: 'Production'}, 
  {slug: 'connectionscapability', name: 'Connections'}, 
];

type Section = 'Team' | 'Roster' | 'Unavailability';
const sections: ReadonlyArray<Section> = ['Team', /*'Roster',*/ 'Unavailability'];


export const App = () => {
  const fluro = useFluroApiState()
  const [section, setSection] = React.useState<Section>('Team')
  const [capability, setCapability] = React.useState<CapabilitySlug>(capabilities[0].slug)
  const capabilityInfo = capabilities.filter(c => c.slug === capability)[0] ?? null;
  return (
    <ApiContext.Provider value={fluro}>
      {fluro.auth.api ? 
        <>
          <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary border-bottom" style={{background: '#f7f8fa'}}>
            <div className="container-fluid">
              <a className="navbar-brand" href="./">Fluro Extras</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mb-2 mb-lg-0 border-start border-end border-secondary-subtle">

                  {sections.map(s => (
                    <li className="nav-item">
                      <button key={s} type="button" 
                        className={cs('btn btn-link nav-link', s == section && 'active text-primary')}
                        onClick={() => setSection(s)}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 border-start border-end border-secondary-subtle">

                  {capabilities.map(c => (
                    <li className="nav-item">
                      <button key={c.slug} type="button" 
                        className={cs('btn btn-link nav-link', c.slug == capability && 'active text-primary')}
                        onClick={() => setCapability(c.slug)}
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}

                </ul>
                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {fluro.auth.data?.firstName}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <AuthInfo/>
                      <li><hr className="dropdown-divider"/></li>
                      <li><button className="btn btn-link dropdown-item  rounded-0" onClick={() => fluro.logout()}>Logout</button></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className='container-fluid mt-3 w-100'>


            {section === 'Team' && capabilityInfo && fluro.team?.reload && 
              <>
                <SectionHeading reload={fluro.team}>Capabilities: {capabilityInfo.name}</SectionHeading>
                <TeamTable capability={capabilityInfo}/>
              </>
            }
            {section === 'Roster' && capabilityInfo && fluro.eventDetails?.reload && 
              <>
                <SectionHeading reload={fluro.eventDetails}>Roster: {capabilityInfo.name}</SectionHeading>
                <Roster/>
              </>
            }
          </div>

            {section === 'Unavailability' && capabilityInfo && fluro.unavailability?.reload && 
              <>
                <div className='container-fluid mt-3 w-100'>
                  <SectionHeading reload={fluro.unavailability}>Unavailability: {capabilityInfo.name}</SectionHeading>
                </div>
                <div className='container-fluid mt-3 w-100' style={{overflowX: 'auto'}}>
                  <TeamUnavailability type={capability}/>
                </div>
              </>
            }

          {/* <Campuses/> */}

        </> 
      : 
        <>
          <div style={{maxWidth: '300px'}} className="mx-auto">
            <div className="my-5 card text-bg-light">
              <div className="card-body">
                <h5 className='mb-3 border-bottom pb-3'>Humphrey's Fluro Extras</h5>
                <LoginForm/>
              </div>
            </div>
            <div className='small text-muted px-3 mb-5'>
              <p><b>Is is safe to enter my Fluro password?</b></p>
              <p><b>Yes.</b> Your password passwed straight to the official Fluro API (and then forgotten) to 
              receive an access token which is wiped by the browser when you close this tab.</p>
              <p><b>But,</b> you shouldn't believe any website that says this (including this one) as 
              they could be lying or trying to scam you!</p>
            </div>
          </div>
        </>
      }

    </ApiContext.Provider>
  );
}
