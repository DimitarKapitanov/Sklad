import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Accordion, AccordionTitleProps, Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import OrdersActions from "./OrdersActions";
import OrdersTable from "./OrdersTable";

export default observer(function OrderDashboard() {
  const { orderStore, warehouseStore } = useStore();
  const { loadWareHouses, wareHouseRegistry, wareHouses } = warehouseStore;
  const { loadingDetails, predicate } = orderStore;

  const [activeIndex, setActiveIndex] = useState<string | undefined>(
    wareHouses[0]?.id
  );

  useEffect(() => {
    if (wareHouseRegistry.size < 1) {
      loadWareHouses();
    }
  }, [loadWareHouses, wareHouseRegistry.size]);

  useEffect(() => {
    if (wareHouses.length > 0) {
      setActiveIndex(wareHouses[0].id);
    }
  }, [wareHouses]);

  const handleClick = (
    _: React.MouseEvent<HTMLDivElement>,
    titleProps: AccordionTitleProps
  ) => {
    const id = titleProps.id;
    const newIndex = activeIndex === id ? null : id;
    setActiveIndex(newIndex);
  };

  if (loadingDetails)
    return <LoadingComponent content="Зареждане на поръчки ..." />;

  return (
    <>
      <Grid>
        <Grid.Column width="16">
          <OrdersActions />
          <Accordion fluid styled>
            {predicate.has("warehouseId")
              ? wareHouses
                  .filter(
                    (wareHouse) => wareHouse.id === predicate.get("warehouseId")
                  )
                  .map((wareHouse) => (
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
                            activeIndex={activeIndex}
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
                          id={wareHouse.id}
                          activeIndex={activeIndex}
                        />
                      )}
                    </Accordion.Content>
                  </div>
                ))}
          </Accordion>
        </Grid.Column>
      </Grid>
    </>
  );
});
