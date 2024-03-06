import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Card, Grid } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

import LoadingComponent from "../../app/layout/LoadingComponent";
import WarehouseCard from "../../app/common/cards/WarehouseCard";
import WarehousesActions from "./WarehousesActions";

export default observer(function Warehouses() {
  const { warehouseStore } = useStore();
  const { loadingInitial, loadWareHouses, wareHouses, wareHouseRegistry } =
    warehouseStore;

  useEffect(() => {
    if (wareHouseRegistry.size <= 1) loadWareHouses();
  }, [wareHouseRegistry, loadWareHouses]);

  if (loadingInitial || !wareHouses) return <LoadingComponent />;

  return (
    <>
      <WarehousesActions />
      <Grid>
        <Grid.Column width="16">
          <Card.Group itemsPerRow={3} className="warehouse-cards">
            {wareHouses.map((warehouse) => (
              <WarehouseCard key={warehouse.id} warehouse={warehouse} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </>
  );
});
