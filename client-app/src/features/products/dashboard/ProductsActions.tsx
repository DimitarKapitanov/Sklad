import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Header, Icon, Input, Menu, MenuItem, Reveal, Select, } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import CategoriesForm from "../../categories/form/CategoriesForm";
import UnitModal from "../../units/form/UnitModal";

export default observer(function ProductActions() {
  const navigate = useNavigate();
  const { modalStore, productStore, unitStore: { unitRegistry, loadUnits }, categoryStore: { loadCategories, categoryOptions } } = useStore();
  const { openModal } = modalStore;

  const { predicate, setPredicate, uploadProductsFile, isFileUploaded, loadingDataSeedInfo } = productStore;

  useEffect(() => {
    if (unitRegistry.size < 1) {
      loadUnits();
    }
  }, [loadUnits, unitRegistry.size]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!isFileUploaded) loadingDataSeedInfo();
  }, [isFileUploaded, loadingDataSeedInfo]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadProductsFile(event)
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
        }}
        className="product-actions"
      >
        <Header as="h2" content="Продукти" />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Reveal animated='move down' style={{ margin: '0 5px' }}>
            <Reveal.Content visible style={{ width: '100%' }}>
              <Button
                style={{ backgroundColor: '#f0f8ff' }}
                fluid
                content={'Добави продукт'}
              />
            </Reveal.Content>
            <Reveal.Content hidden>
              <Button
                fluid
                basic
                color={'blue'}
                onClick={() => navigate("/create-product")}
              >
                Kъм формата <Icon name='arrow right' />
              </Button>
            </Reveal.Content>
          </Reveal>
          <Reveal animated='move up' style={{ margin: '0 5px' }}>
            <Reveal.Content visible style={{ width: '100%' }}>
              <Button
                fluid
                style={{ backgroundColor: '#f0f8ff' }}
                content={'Добави категория'}
              />
            </Reveal.Content>
            <Reveal.Content hidden>
              <Button
                fluid
                basic
                color={'blue'}
                onClick={() => openModal(<CategoriesForm />, "mini")}
              >
                Добави <Icon name='arrow right' />
              </Button>
            </Reveal.Content>
          </Reveal>
          <Reveal animated='move down' style={{ margin: '0 5px' }}>
            <Reveal.Content visible style={{ width: '100%' }}>
              <Button
                fluid
                style={{ backgroundColor: '#f0f8ff' }}
                content={'Добави мярка'}
              />
            </Reveal.Content>
            <Reveal.Content hidden>
              <Button
                fluid
                basic
                color={'blue'}
                onClick={() => openModal(<UnitModal />, "mini")}

              >
                Добави <Icon name='arrow right' />
              </Button>
            </Reveal.Content>
          </Reveal>
          {!isFileUploaded && (
            <>
              <Reveal animated='move down' style={{ margin: '0 5px' }}>
                <Reveal.Content visible style={{ width: '100%' }}>
                  <Button
                    fluid
                    style={{ backgroundColor: '#f0f8ff' }}
                    content={'Качи Excel файл'}
                  />
                </Reveal.Content>
                <Reveal.Content hidden>
                  <Button
                    fluid
                    basic
                    color={'blue'}
                    content={'Качи Excel файл'}
                    as='label'
                    htmlFor="file-upload"
                  />
                  <input id="file-upload" type="file" accept=".xlsx,.xls" hidden onChange={handleFileUpload} />
                </Reveal.Content>
              </Reveal>
            </>
          )}
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
              setPredicate("search", event.target.value.toLowerCase());
            }}
          />
        </MenuItem>
        <MenuItem style={{ height: "47px" }}>
          <Select
            clearable
            placeholder="Категория"
            options={categoryOptions}
            value={predicate.get("categoryName")}
            onChange={(_, data) => {
              setPredicate("categoryName", data.value as string);
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
});
