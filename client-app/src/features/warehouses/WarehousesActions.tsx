import { useNavigate } from "react-router-dom";
import { Button, Divider, Header } from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";

export default observer(function WarehousesActions() {
  const { userStore: { user } } = useStore();
  const navigate = useNavigate();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <Header as="h2" content="Складове" />
        <div>
          {user?.role.includes("Admin") || user?.role.includes("Manager") ? (
            <Button
              primary
              onClick={() => {
                navigate("/warehouses/create");
              }}
            >
              Създай склад
            </Button>
          ) : null}
        </div>
      </div>
      <Divider />
    </>
  );
});
