import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import SidebarNav from './SidebarNav';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <SidebarNav />
          <Container style={{ marginTop: '7em', width: '90%' }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  )
}

export default observer(App);
