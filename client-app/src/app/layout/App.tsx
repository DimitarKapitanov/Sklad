import { observer } from "mobx-react-lite";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "semantic-ui-react";
import { useScreenSize } from "../../hooks/useScreenSize";
import { useToken } from "../../hooks/useToken";
import { useStore } from "../stores/store";

import HomePage from "../../features/home/HomePage";
import ModalContainer from "../common/modals/ModalContainer";
import LoadingComponent from "./LoadingComponent";
import NavBar from "./NavBar";
import SidebarNav from "./SidebarNav";

function App() {
  const { isMobile } = useScreenSize();
  const { tokenValid } = useToken();
  const { commonStore } = useStore();
  const location = useLocation();

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Зареждане ..." />;

  return (
    <>
      <ScrollRestoration />
      <ModalContainer />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          {!isMobile && <SidebarNav tokenValid={tokenValid} />}
          {isMobile && <NavBar />}
          <>
            <Container className={`body-container`} fluid={true}>
              <div>
                <Outlet />
              </div>
              <footer className="footer">
                <div className="footer-body">
                  <div className="footer-text">
                    <p>Решения в областта на информационните и комуникационни технологии и киберсигурността в малките и средните предприятия</p>
                  </div>
                  <div className="footer-image">
                    <img src="/assets/pvu_image.png" alt="logo" height={40} />
                    <img src="/assets/fes_image.png" alt="logo" height={40} />
                  </div>
                </div>
              </footer>
            </Container>
          </>
        </>
      )}
    </>
  );
}

export default observer(App);
