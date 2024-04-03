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
  const { orderStore, warehouseStore: { wareHouseOptions }, userStore: { user } } = useStore();
  const { predicate, setPredicate, setActiveIndex } = orderStore;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header as="h2" content="Поръчки" />
        <Menu.Menu >
          <MenuItem>
            <Button
              primary
              content="Добави поръчка"
              as={Link}
              to={"/test-order-form"}
            />
          </MenuItem>
        </Menu.Menu>
        {user?.role.includes("Admin") || user?.role.includes("Manager") ? (
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
        ) : null}
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
        className="actions-inputs order-filter"
      >
        <div className="search-warehouse-select">
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
          {user?.role.includes("Admin") || user?.role.includes("Manager") ? (
            <MenuItem style={{ height: "50px" }}>
              <Select
                className="warehouse-select"
                clearable
                placeholder="Склад"
                options={wareHouseOptions}
                value={predicate.get("warehouseId")}
                onChange={(_, data) => {
                  if (data.value === "") {
                    predicate.delete("warehouseId");
                    setActiveIndex(wareHouseOptions.find((option) => option.text === "Главен склад")?.value as string);
                  } else {
                    setPredicate("warehouseId", data.value as string);
                    setActiveIndex(data.value as string)
                  }
                }}
              />
            </MenuItem>
          ) : null}
        </div>
        <div className="date-selectors">
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
