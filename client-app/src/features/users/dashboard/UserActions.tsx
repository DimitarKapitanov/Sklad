import { observer } from "mobx-react-lite";
import {
  Button,
  Divider,
  Header
} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import CreateUser from "../CreateUser";

export default observer(function UserActions() {
  const { modalStore } = useStore();
  const { openModal } = modalStore;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
        <Header as="h2" content="Служители" />
        <div>
          <Button
            primary
            onClick={() => openModal(<CreateUser />, "tiny")}
            content="Добави служител"
            icon="user plus"
            size="tiny"
          />
        </div>
      </div>
      <Divider />
    </>
  );
});
