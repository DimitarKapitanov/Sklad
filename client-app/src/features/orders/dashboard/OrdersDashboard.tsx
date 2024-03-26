import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Accordion, AccordionTitleProps, Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import OrdersActions from "./OrdersActions";
import OrdersTable from "./OrdersTable";

export default observer(function OrderDashboard() {
  const { orderStore, warehouseStore, userStore: { user } } = useStore();
  const { loadWareHouses, wareHouseRegistry, wareHouses } = warehouseStore;
  const { loadingDetails, predicate, activeIndex, setActiveIndex } = orderStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (wareHouseRegistry.size < 1) loadWareHouses();
  }, [loadWareHouses, wareHouseRegistry.size]);

  useEffect(() => {
    if (id) {
      setActiveIndex(id);
    } else if (wareHouses.length > 0) {
      setActiveIndex(wareHouses[0].id);
    }
  }, [id, setActiveIndex, wareHouses]);

  const handleClick = (_: React.MouseEvent<HTMLDivElement>, titleProps: AccordionTitleProps) => {
    const id = titleProps.id;
    const newIndex = activeIndex === id ? null : id;
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const userWarehouses = wareHouses.filter(wareHouse => wareHouse.userName === user?.userName);
    if (userWarehouses.length > 0) {
      setActiveIndex(userWarehouses[0].id);
    }
  }, [wareHouses, user, setActiveIndex]);

  if (loadingDetails)
    return <LoadingComponent content="Зареждане на поръчки ..." />;

  return (
    <>
      <Grid>
        <Grid.Column width="16">
          <OrdersActions />
          <Accordion fluid styled>
            {user?.role.includes("Admin") || user?.role.includes("Manager") ? (
              predicate.has("warehouseId") ? wareHouses.filter(
                (wareHouse) => wareHouse.id === predicate.get("warehouseId")).map((wareHouse) => (
                  <div key={wareHouse.id}>
                    <Accordion.Title
                      active={activeIndex === wareHouse.id}
                      id={wareHouse.id}
                      onClick={handleClick}
                      icon="dropdown"
                      content={wareHouse.name}
                    ></Accordion.Title>
                    <Accordion.Content active={activeIndex === wareHouse.id}>
                      {activeIndex === wareHouse.id && (
                        <OrdersTable
                          id={wareHouse.id}
                        />
                      )}
                    </Accordion.Content>
                  </div>
                ))
                : wareHouses.map((wareHouse) => (
                  <div key={wareHouse.id}>
                    <Accordion.Title
                      active={activeIndex === wareHouse.id}
                      id={wareHouse.id}
                      onClick={handleClick}
                      icon="dropdown"
                      content={wareHouse.name}
                    ></Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === wareHouse.id}
                      style={{ overflowX: "auto" }}
                    >
                      {activeIndex === wareHouse.id && (
                        <OrdersTable
                          id={activeIndex}
                        />
                      )}
                    </Accordion.Content>
                  </div>
                ))
            ) : wareHouses.filter(wareHouse => wareHouse.userName === user?.userName).length > 0 ? (
              wareHouses.filter(wareHouse => wareHouse.userName === user?.userName).map((wareHouse) => (
                <div key={wareHouse.id}>
                  <Accordion.Title
                    active={activeIndex === wareHouse.id}
                    id={wareHouse.id}
                    onClick={handleClick}
                    icon="dropdown"
                    content={wareHouse.name}
                  ></Accordion.Title>
                  <Accordion.Content
                    active={activeIndex === wareHouse.id}
                    style={{ overflowX: "auto" }}
                  >
                    {activeIndex === wareHouse.id && (
                      <OrdersTable
                        id={activeIndex}
                      />
                    )}
                  </Accordion.Content>
                </div>
              ))
            ) : (
              <p>Няма зачислен склад.</p>
            )}
          </Accordion>
        </Grid.Column>
      </Grid>
    </>
  );
});
