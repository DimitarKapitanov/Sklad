import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DecodedToken } from "../app/models/decodedToken";
import { useStore } from "../app/stores/store";

import LoginForm from "../features/users/LoginForm";

export function useToken() {
  const [tokenValid, setTokenValid] = useState(false);
  const { commonStore, userStore, modalStore } = useStore();
  const navigate = useNavigate();

  const checkToken = useCallback(
    (checkOnly?: boolean, e?: MouseEvent, redirect?: boolean) => {
      if (!modalStore.modal.open) {
        const token = sessionStorage.getItem("jwt");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          if (decodedToken) {
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
              if (!checkOnly) modalStore.openModal(<LoginForm />, "mini");
              if (e) e.preventDefault();
              if (redirect) navigate("/");
              setTokenValid(false);
            } else {
              setTokenValid(true);
            }
          }
        } else {
          if (!checkOnly) modalStore.openModal(<LoginForm />, "mini");
          if (e) e.preventDefault();
          setTokenValid(false);
        }
      }
    },
    [modalStore, navigate]
  );

  const mousedownListener = useCallback(
    (e: MouseEvent | undefined) => {
      checkToken(false, e);
    },
    [checkToken]
  );

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  useEffect(() => {
    checkToken(false, undefined, true);
    checkToken(true);
  }, [checkToken, modalStore.modal.open]);

  useEffect(() => {
    document.addEventListener("mousedown", mousedownListener);

    return () => {
      document.removeEventListener("mousedown", mousedownListener);
    };
  }, [mousedownListener]);

  return { tokenValid };
}
