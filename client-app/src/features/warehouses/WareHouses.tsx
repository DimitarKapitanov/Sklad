import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Card, Grid, Header } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

import WarehouseCard from "../../app/common/cards/WarehouseCard";
import LoadingComponent from "../../app/layout/LoadingComponent";
import WarehousesActions from "./WarehousesActions";

export default observer(function Warehouses() {
  const { warehouseStore, userStore: { user } } = useStore();
  const { loadingInitial, loadWareHouses, wareHouses, wareHouseRegistry } =
    warehouseStore;

  useEffect(() => {
    if (wareHouseRegistry.size < 1) loadWareHouses();
  }, [wareHouseRegistry, loadWareHouses]);

  if (loadingInitial || !wareHouses) return <LoadingComponent />;

  return (
    <>
      <WarehousesActions />
      {wareHouses.find(cpi => cpi.userName === user?.userName || user?.role === "Admin") ? (
        <Grid>
          <Grid.Column width="16">
            <Card.Group itemsPerRow={3} className="warehouse-cards">
              {wareHouses
                .filter(warehouse => user?.role.includes('Admin') || user?.role.includes('Manager') || warehouse.userName === user?.userName)
                .map((warehouse) => (
                  <WarehouseCard key={warehouse.id} warehouse={warehouse} />
                ))}
            </Card.Group>
          </Grid.Column>
        </Grid>
      ) : <div style={{
        display: 'block', width: 700, padding: 30
      }}>
        <Header as="h2" content="Все още не се прикрепен към никой склад!" />
        <Header as="h3" content="За повече информация моля обърнете се към вашия администратор!" />
      </div>}
    </>
  );
});
