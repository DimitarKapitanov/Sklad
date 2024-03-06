import { useNavigate } from "react-router-dom";
import {
  Button,
  Header,
  Input,
  Menu,
  MenuItem,
  Select,
} from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import { useStore } from "../../../app/stores/store";
import UnitModal from "../../units/form/UnitModal";

export default observer(function ProductActions() {
  const navigate = useNavigate();
  const { modalStore, productStore } = useStore();
  const { openModal } = modalStore;

  const { predicate, setPredicate, setLocalSearch } = productStore;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
        className="product-actions"
      >
        <Header as="h2" content="Продукти" />
        <div>
          <Button
            primary
            onClick={() => {
              navigate("/create-product");
            }}
          >
            Създай продукт
          </Button>
          <Button
            primary
            onClick={() => {
              openModal(<UnitModal />, "mini");
            }}
          >
            Добави единица
          </Button>
        </div>
      </div>
      <Menu pointing secondary className="actions-sort">
        <MenuItem
          active={predicate.has("all")}
          onClick={() => setPredicate("all", "true")}
          content="Всички продукти"
        />
        <MenuItem
          active={predicate.has("decreasingQuantity")}
          onClick={() => setPredicate("decreasingQuantity", 10)}
          content="С намаляващо количество"
        />
        <MenuItem
          active={predicate.has("isZeroQuantity")}
          onClick={() => setPredicate("isZeroQuantity", "true")}
          content="С нулево количество"
        />
        <MenuItem
          active={predicate.has("isDeleted")}
          onClick={() => setPredicate("isDeleted", "true")}
          content="Изтрити продукти"
        />
      </Menu>
      <Menu
        pointing
        secondary
        style={{ borderBottom: "none" }}
        className="search-inputs actions-inputs"
      >
        <MenuItem style={{ paddingLeft: 0 }}>
          <Input
            className="icon"
            icon="search"
            placeholder="Търси..."
            value={productStore.localSearch}
            style={{ paddingLeft: "0" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPredicate("search", event.target.value);
              setLocalSearch(event.target.value);
            }}
          />
        </MenuItem>
        <MenuItem style={{ height: "47px" }}>
          <Select
            clearable
            placeholder="Категория"
            options={categoryOptions}
            value={predicate.get("category")}
            onChange={(_, data) => {
              setPredicate("category", data.value as string);
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
});
