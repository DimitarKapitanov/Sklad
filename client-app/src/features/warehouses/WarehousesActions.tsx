import { useNavigate } from "react-router-dom";
import { Divider, Header } from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import RevealButton from "../../app/common/buttons/RevealButton";
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
            <RevealButton visibleContent="Добави нов склад" hiddenContent="Към формата" onClick={() => navigate("/warehouses/create")} />
          ) : null}
        </div>
      </div>
      <Divider />
    </>
  );
});
