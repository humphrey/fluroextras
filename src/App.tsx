import { ApiContext, useFluroApiState } from './fluroapi/context';
import { LoginForm } from './LoginForm';
import { Campuses } from './Campuses';
import { ReloadButton } from './fluroapi/ReloadButton';
import { Roster } from './Roster';
import { Team } from './Team';
import { TeamUnavailability } from './TeamUnavailability';


export const App = () => {
  const fluro = useFluroApiState()
  return (
    <ApiContext.Provider value={fluro}>
      {fluro.auth.api ? <>
        <div className='bg-dark text-white mb-2 d-flex align-items-center'>
          <div className='p-3 me-auto'>Simple Fluro Schedular</div>
          <div className='p-3'>{fluro.auth.data?.firstName}</div>
          {fluro.auth.data && <button className='btn btn-dark' onClick={() => fluro.auth.logout()}>Logout</button>}
        </div>

        <Campuses/>

        {fluro.team?.reload && <>
          <h5>Team <ReloadButton {...fluro.team}/></h5>
          <Team/>
        </>}
        {fluro.eventDetails?.reload && <>
          <h5>Team Roster <ReloadButton {...fluro.eventDetails}/></h5>
          <Roster/>
        </>}
        {fluro.unavailability?.reload && <>
          <h5>Worship Team Unavailability <ReloadButton {...fluro.unavailability}/></h5>
          <TeamUnavailability type="worshipCapability"/>
          <h5>Production Team Unavailability <ReloadButton {...fluro.unavailability}/></h5>
          <TeamUnavailability type="worshipproduction"/>
          <h5>Connection Team Unavailability <ReloadButton {...fluro.unavailability}/></h5>
          <TeamUnavailability type="connectionscapability"/>
        </>}
      </> : 
      <LoginForm/>}

    </ApiContext.Provider>
  );
}
