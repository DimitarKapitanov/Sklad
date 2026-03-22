import { useNavigate } from "react-router-dom";
import {
  Header,
  Input,
  Menu,
  MenuItem,
  MenuMenu
} from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import RevealButton from "../../../app/common/buttons/RevealButton";
import { useStore } from "../../../app/stores/store";

export default observer(function PartnersActions() {
  const navigate = useNavigate();

  const { partnerStore } = useStore();
  const { primaryPredicate, setPrimaryPredicate } = partnerStore;

  return (
    <>
      <div
        className="product-actions"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Header as="h2" content="Партньори" />
        <MenuMenu position="right" className="reveal-buttons">
          <MenuItem>
            <RevealButton visibleContent="Добави партньор" hiddenContent="Към формата" onClick={() => navigate("/partners/create")} />
          </MenuItem>
        </MenuMenu>
      </div>
      <Menu pointing secondary className="actions-sort">
        <MenuItem
          active={primaryPredicate.has("all")}
          onClick={() => setPrimaryPredicate("all", "true")}
          content={"Всички партньори"}
        />
        <MenuItem
          active={primaryPredicate.has("isSupplier")}
          onClick={() => setPrimaryPredicate("isSupplier", "true")}
          content={"Доставчици"}
        />
        <MenuItem
          active={primaryPredicate.has("isClient")}
          onClick={() => setPrimaryPredicate("isClient", "true")}
          content={"Клиенти"}
        />
      </Menu>
      <Menu pointing secondary style={{ borderBottom: "none" }}>
        <MenuItem style={{ paddingRight: 0 }} position="right">
          <Input
            className="icon"
            icon="search"
            placeholder="Име на фирмата ..."
            style={{ paddingLeft: "0" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPrimaryPredicate("search", event.target.value);
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
});
