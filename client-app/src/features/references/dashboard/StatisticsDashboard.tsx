import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import SoldProductTable from "../table/SoldProductsTable";

import DeliveredTable from "../table/DeliveriesTable";
import StatisticActions from "./StatisticActions";
export default observer(function StatisticsDashboard() {
  const { statisticsStore, warehouseStore: { loadWareHouses, wareHouseRegistry } } = useStore();
  const { soldProductRegistry, loadSoldProducts, predicate } = statisticsStore;

  useEffect(() => {
    if (wareHouseRegistry.size < 1) loadWareHouses();
  }, [wareHouseRegistry.size, loadWareHouses]);

  useEffect(() => {
    if (soldProductRegistry.size < 1) loadSoldProducts();
  }, [soldProductRegistry.size, loadSoldProducts]);

  return (
    <Container textAlign="justified" fluid>
      <StatisticActions />
      {predicate.has('sales') ? <SoldProductTable /> : <DeliveredTable />}
    </Container>
  );
});
