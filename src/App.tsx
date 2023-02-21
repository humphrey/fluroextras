import { ApiContext, useFluroApiState } from './fluroapi/context';
import { LoginForm } from './LoginForm';
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Link,
//   Outlet,
// } from "react-router-dom";
import { Campuses } from './Campuses';
import { ReloadButton } from './fluroapi/ReloadButton';
import { Roster } from './Roster';
import { Team } from './Team';
import { TeamUnavailability } from './TeamUnavailability';



// const Root = () => {
//   const apiState = useApiStore();
//   return (
//     <>
//       {/* <nav className="navbar navbar-expand-lg bg-light border-bottom mb-3" style={{backgroundColor: '#e3f2fd'}}>
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">Simple Fluro Scheduler</a>
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <Link className="nav-link active" aria-current="page" to="/">Home</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link active" aria-current="page" to="/team">Team</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link active" aria-current="page" to="/roster">Roster</Link>
//               </li>
//             </ul>
//             <div>{api.auth?.name ?? 'Not logged in'}</div>
//             <button className="btn btn-outline-dark" type="button" onClick={async () => await api.updateAllData()}>Reload</button>
//           </div>
//         </div>
//       </nav> */}

//       {/* <Outlet/> */}
//       {!apiState.auth && <LoginForm/>}

//     </>
//   )
// };

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root/>,
//     children: [
//       {
//         path: "/team",
//         element: <Team/>,
//       },
//       {
//         path: "/roster",
//         element: <Roster/>,
//       },]
//   },
// ]);

function App() {
  const fluro = useFluroApiState()
  return (
    <ApiContext.Provider value={fluro}>
      {/* <RouterProvider router={router} /> */}
      {fluro.auth.api ? <>
        <div className='bg-dark text-white mb-2 d-flex align-items-center'>
          <div className='p-3 me-auto'>Simple Fluro Schedular</div>
          <div className='p-3'>{fluro.auth.data?.firstName}</div>
          {fluro.auth.data && <button className='btn btn-dark' onClick={() => fluro.auth.logout()}>Logout</button>}
          {/* <button className="btn btn-light mx-3" type="button" onClick={async () => await apiState.updateAllData()}>Reload</button> */}
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

export default App;
