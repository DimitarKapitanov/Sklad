import { useNavigate } from "react-router-dom";
import { Button, Header, Input, Menu, MenuItem } from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";

export default observer(function WarehousesActions() {
  const navigate = useNavigate();

  const { warehouseStore } = useStore();
  const { search, setSearch } = warehouseStore;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header as="h2" content="Складове" />
        <div>
          <Button
            primary
            onClick={() => {
              navigate("/warehouses/create");
            }}
          >
            Създай склад
          </Button>
        </div>
      </div>
      <Menu
        pointing
        secondary
        style={{ borderBottom: "none" }}
        className="actions-inputs"
      >
        <MenuItem style={{ paddingLeft: 0 }}>
          <Input
            className="icon"
            icon="search"
            placeholder="Търси..."
            style={{ paddingLeft: "0" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </MenuItem>
      </Menu>
    </>
  );
});
