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
import { useEffect } from "react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import * as XLSX from 'xlsx';
import { UploadedProduct } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";
import UnitModal from "../../units/form/UnitModal";

export default observer(function ProductActions() {
  const navigate = useNavigate();
  const { modalStore, productStore, unitStore: { unitRegistry, loadUnits, getUnitsByAcronym }, categoryStore: { loadCategories, categoryOptions } } = useStore();
  const { openModal } = modalStore;

  const { predicate, setPredicate } = productStore;
  useEffect(() => {
    if (unitRegistry.size < 1) {
      loadUnits();
    }
  }, [loadUnits, unitRegistry.size]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) {
        throw new Error('Не е намерен файл.');
      }
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          if (evt.target === null) {
            throw new Error('Не е намерен файл.');
          }
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          const uploadedProducts: UploadedProduct[] = (data as [string, string, number, string, string, number, string, string][]).map((row) => {
            const unitId = getUnitsByAcronym(row[3]);
            if (!unitId) {
              throw new Error(`Не е намерена мярка '${row[3]}' в системата.`);
            }

            const categoryValue = categoryOptions.find((category) => category.text === row[1])?.value;
            if (!categoryValue) {
              throw new Error(`Не е намерена категория "${row[1]}" в системата. Евентуална грешка в името на категорията или езика на категорията или категорията не е добавена в системата.`);
            }

            return {
              id: uuid(),
              name: row[0],
              categoryId: categoryValue,
              quantity: row[2],
              unitId: unitId,
              description: row[4],
              deliveryPrice: row[6],
              price: row[7],
            };
          });
          productStore.uploadProducts(uploadedProducts);
        } catch (error) {
          toast.error(String(error));
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      toast.error(String(error));
    }
  };

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
          <Button
            primary
            as="label" // Make the button act as a label
            htmlFor="file-upload" // Associate the label with the input
          >
            Качи Excel файл
          </Button>
          <input id="file-upload" type="file" accept=".xlsx,.xls" hidden onChange={handleFileUpload} />
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
            style={{ paddingLeft: "0" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPredicate("search", event.target.value);
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
