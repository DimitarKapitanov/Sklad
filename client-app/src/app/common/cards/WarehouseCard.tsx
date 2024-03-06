import { Card, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Warehouse } from "../../models/warehouse";
import { Link } from "react-router-dom";
import { ButtonGroup, Button } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import EditWarehouse from "../../../features/warehouses/EditWarehouse";
import { useEffect } from "react";

interface Props {
  warehouse: Warehouse;
}

export default observer(function WarehouseCard({ warehouse }: Props) {
  const { modalStore, warehouseStore } = useStore();

  useEffect(() => {
    if (!warehouseStore.isEditing) {
      modalStore.closeModal();
    }
  }, [modalStore, warehouseStore.isEditing]);

  return (
    <Card>
      <Card.Content>
        <Label color="green" icon="check" corner="right" />
        <Card.Header style={{ marginBottom: "1.6vh" }}>
          Склад: {warehouse.name}
        </Card.Header>

        <Card.Description>
          <div>
            <strong>Контактно лице: </strong>
            {warehouse.userName}
          </div>
          <div>
            <strong>Допълнителна информация: </strong>
            {warehouse.description}
          </div>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui ">
          <ButtonGroup size="large" fluid widths="2">
            <Link
              to={`/orders/warehouse/${warehouse.id}`}
              className="ui blue button"
            >
              Поръчки
            </Link>
            <Button
              color="red"
              onClick={() =>
                modalStore.openModal(
                  <EditWarehouse warehouseData={warehouse} />, "mini"
                )
              }
            // size="huge"
            >
              Редактиране
            </Button>
          </ButtonGroup>
        </div>
      </Card.Content>
    </Card>
  );
});
