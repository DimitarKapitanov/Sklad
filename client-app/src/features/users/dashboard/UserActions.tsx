import { observer } from "mobx-react-lite";
import {
  Divider,
  Header
} from "semantic-ui-react";
import RevealButton from "../../../app/common/buttons/RevealButton";
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
          <RevealButton visibleContent="Добави служител" hiddenContent="Към формата" onClick={() => openModal(<CreateUser />, "tiny")} icon="user plus" />
        </div>
      </div>
      <Divider />
    </>
  );
});
