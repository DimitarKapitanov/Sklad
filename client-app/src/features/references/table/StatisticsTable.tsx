import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import DeliveredProductsTable from "./DeliveriesTable";
import SoldProductsTable from "./SoldProductsTable";

export default observer(function StatisticsTable() {
    const { statisticsStore } = useStore();
    const { deliveredProductRegistry: deliveredProductStatistics, soldProductRegistry, loadingInitial } = statisticsStore;

    return (
        deliveredProductStatistics && deliveredProductStatistics.size > 0 ?
            <DeliveredProductsTable /> : soldProductRegistry && soldProductRegistry.size > 0 ? <SoldProductsTable /> : loadingInitial ? <LoadingComponent /> : "Няма информация за тези дати"
    );
});