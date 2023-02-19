import React from 'react';
import { ApiContext, useApiState } from './api/context';
import { LoginForm } from './LoginForm';
import { TeamTable } from './TeamTable';
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
} from "react-router-dom";
import { Team } from './Team';
import { Roster } from './Roster';



const Root = () => {
  const api = useApiState();
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light border-bottom mb-3" style={{backgroundColor: '#e3f2fd'}}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Simple Fluro Scheduler</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/team">Team</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/roster">Roster</Link>
              </li>
            </ul>
            <div>{api.auth?.name ?? 'Not logged in'}</div>
            <button className="btn btn-outline-dark" type="button" onClick={async () => await api.updateAllData()}>Reload</button>
          </div>
        </div>
      </nav>

      <Outlet/>
      {!api.auth && <LoginForm/>}

    </>
  )
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: "/team",
        element: <Team/>,
      },
      {
        path: "/roster",
        element: <Roster/>,
      },]
  },
]);

function App() {
  const apiState = useApiState()
  return (
    <ApiContext.Provider value={apiState}>
      <RouterProvider router={router} />
    </ApiContext.Provider>
  );
}

export default App;
