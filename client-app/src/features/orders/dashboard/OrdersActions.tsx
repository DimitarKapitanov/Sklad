import { observer } from "mobx-react-lite";
import React from "react";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import {
  Button,
  Header,
  Input,
  Menu,
  MenuItem,
  MenuMenu,
  Select,
} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function OrdersActions() {
  const {
    orderStore,
    warehouseStore: { wareHouseOptions },
  } = useStore();
  const { predicate, setPredicate } = orderStore;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header as="h2" content="Поръчки" />
        <MenuMenu position="right">
          <MenuItem>
            <Button
              primary
              content="Добави поръчка"
              as={Link}
              to={"/orders-create"}
            />
          </MenuItem>
        </MenuMenu>
      </div>
      <Menu pointing secondary className="actions-sort">
        <MenuItem
          active={predicate.has("all")}
          onClick={() => setPredicate("all", "true")}
          style={{ paddingLeft: 0 }}
          content="Всички поръчки"
        />
        <MenuItem
          active={predicate.has("isCompleted")}
          onClick={() => setPredicate("isCompleted", "true")}
          content="Завършени поръчки"
        />
        <MenuItem
          active={predicate.has("isActive")}
          onClick={() => setPredicate("isActive", "true")}
          content="Незавършени поръчки"
        />
      </Menu>
      <Menu
        pointing
        secondary
        style={{ borderBottom: "none" }}
        className="actions-inputs"
      >
        <div>
          <MenuItem style={{ paddingLeft: 0 }} className="custom-search">
            <Input
              className="icon"
              icon="search"
              placeholder="Търси..."
              style={{ height: "38px", paddingLeft: "0" }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPredicate("search", event.target.value);
              }}
            />
          </MenuItem>
          <MenuItem style={{ height: "47px" }}>
            <Select
              className="warehouse-select"
              clearable
              placeholder="Склад"
              options={wareHouseOptions}
              value={predicate.get("warehouseId")}
              onChange={(_, data) => {
                if (data.value === "") {
                  predicate.delete("warehouseId");
                } else setPredicate("warehouseId", data.value as string);
              }}
            />
          </MenuItem>
        </div>
        <div>
          <MenuItem style={{ height: "45px" }}>
            <DatePicker
              selected={predicate.get("startDate")}
              onChange={(date) => {
                setPredicate("startDate", date as Date);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Начална дата"
              isClearable
            />
          </MenuItem>
          <MenuItem style={{ height: "45px" }}>
            <DatePicker
              selected={predicate.get("endDate")}
              onChange={(date) => setPredicate("endDate", date as Date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Крайна дата"
              isClearable
            />
          </MenuItem>
        </div>
      </Menu>
    </>
  );
});
