import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { useScreenSize } from "../../hooks/useScreenSize";
import { useToken } from "../../hooks/useToken";

import HomePage from "../../features/home/HomePage";
import ModalContainer from "../common/modals/ModalContainer";
import LoadingComponent from "./LoadingComponent";
import SidebarNav from "./SidebarNav";
import NavBar from "./NavBar";

function App() {
  const { isMobile } = useScreenSize();
  const { tokenValid } = useToken();
  const { commonStore } = useStore();
  const location = useLocation();

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Зареждане ..." />;

  return (
    <>
      <ModalContainer />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          {!isMobile && <SidebarNav tokenValid={tokenValid} />}
          {isMobile && <NavBar />}
          <Container className={`body-container`} fluid={true}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);
