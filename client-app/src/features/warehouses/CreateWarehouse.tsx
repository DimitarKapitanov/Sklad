import { Formik } from "formik";
import {
  Form,
  Header,
  ButtonGroup,
  Button,
  FormGroup,
  Segment,
} from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Link } from "react-router-dom";
import MyTextInput from "../../app/common/form/MyTextInput";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Warehouse } from "../../app/models/warehouse";
import { v4 as uuid } from "uuid";
import MySelectInput from "../../app/common/form/MySelectInput";
import { useEffect } from "react";

export default observer(function CreateWarehouse() {
  const { commonStore, warehouseStore, userStore } = useStore();
  const { newWarehouseValidationSchema } = commonStore;
  const { createWarehouse, loading } = warehouseStore;
  const { usersOptions, userRegistry, loadUsers, getUsers } = userStore;
  const navigate = useNavigate();

  useEffect(() => {
    if (userRegistry.size <= 1) loadUsers();
  }, [userRegistry, loadUsers]);

  const handleCreateWarehouse = (warehouse: Warehouse) => {
    warehouse.userName =
      getUsers.find((x) => x.id === warehouse.contactPersonId)?.displayName ||
      "";
    warehouse.id = uuid();
    createWarehouse(warehouse).then(() => navigate("/warehouses"));
  };

  const warehouse: Warehouse = {
    id: "",
    name: "",
    userName: "",
    contactPersonId: "",
    description: "",
  };

  return (
    <Segment clearing>
      <Header
        content="Създай склад"
        sub
        color="teal"
        style={{ paddingBottom: "2vh" }}
      />

      <Formik
        validationSchema={newWarehouseValidationSchema}
        initialValues={warehouse}
        onSubmit={(values) => {
          handleCreateWarehouse(values);
        }}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <>
              <FormGroup inline widths="equal">
                <MyTextInput placeholder="Име" label="Име" name={`name`} />
                <MySelectInput
                  options={usersOptions}
                  placeholder="Kонтактно лице "
                  label="Kонтактно лице"
                  name={`contactPersonId`}
                />
                <MyTextInput
                  placeholder="Допълнителна информация"
                  label="Допълнителна информация"
                  name={`description`}
                />
              </FormGroup>
            </>

            <ButtonGroup floated="right">
              <Button
                disabled={isSubmitting || !dirty || !isValid}
                loading={loading}
                type="submit"
                positive
              >
                Изпрати
              </Button>
              <Button
                as={Link}
                to="/warehouses"
                color="red"
                type="button"
                content="Отказ"
              />
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
