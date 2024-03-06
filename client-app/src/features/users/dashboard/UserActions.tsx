import {
  Button,
  Header,
  Input,
  Menu,
  MenuItem,
  MenuMenu,
} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import CreateUser from "../CreateUser";

export default observer(function UserActions() {
  const {  modalStore, userStore } = useStore();
  const { openModal } = modalStore;
  const { setSearch, search } = userStore;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header as="h2" content="Потребители" />
        <div>
          <Button
            primary
            onClick={() => openModal(<CreateUser />, "tiny")}

          >
            Добави потребител
          </Button>
        </div>
      </div>
      <Menu pointing secondary>
        <MenuMenu style={{ marginTop: "5px" }}>
          <MenuItem style={{ paddingRight: 0, paddingBottom: '20px' }}>
            <Input
              className="icon"
              icon="search"
              placeholder="Търси..."
              style={{ paddingLeft: "0" }}
              value={search}
              onChange={(e) => {setSearch(e.target.value)}}
            />
          </MenuItem>
        </MenuMenu>
      </Menu>
    </>
  );
});
