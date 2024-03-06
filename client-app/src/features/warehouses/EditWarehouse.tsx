import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, Confirm, Header, Label } from "semantic-ui-react";
import MySelectInput from "../../app/common/form/MySelectInput";
import MyTextInput from "../../app/common/form/MyTextInput";
import { UserInfo } from "../../app/models/user";
import { Warehouse } from "../../app/models/warehouse";
import { useStore } from "../../app/stores/store";

interface Props {
  warehouseData: Warehouse;
}

export default observer(function EditWarehouse({ warehouseData }: Props) {
  const { warehouseStore, userStore, modalStore } = useStore();
  const { getUsers, userRegistry, loadUsers } = userStore;

  useEffect(() => {
    if (userRegistry.size <= 1) loadUsers();
  }, [userRegistry.size, loadUsers]);

  const userOptions = getUsers.map((user: UserInfo) => ({
    key: user.id,
    text: user.userName,
    value: user.userName,
  }));

  const { editWarehouse, deleteWarehouse } = warehouseStore;
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);

  const warehouse: Warehouse = {
    id: warehouseData.id,
    name: warehouseData.name,
    description: warehouseData.description,
    userName: warehouseData.userName,
    contactPersonId: warehouseData.contactPersonId,
  };

  return (
    <Formik
      initialValues={warehouse}
      onSubmit={(values) =>
        editWarehouse(warehouseData.id, values)
      }
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <>
            <Form
              className="ui form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <Header
                as="h2"
                content="Редактиране на склад"
                color="teal"
                textAlign="center"
              />
              <MyTextInput
                placeholder="Име на склад"
                name="name"
                label="Име на склад"
              />
              <MyTextInput
                placeholder="Информация"
                name="description"
                label="Допълнителна информация"
              />
              <MySelectInput
                options={userOptions}
                placeholder="Лице за контакт"
                name="userName"
                label="Лице за контакт"
              />
              <ErrorMessage
                name="error"
                render={() => (
                  <Label
                    style={{ marginBottom: 10 }}
                    basic
                    color="red"
                  />
                )}
              />

              <div>
                <Button
                  loading={isSubmitting}
                  positive
                  content="Запази"
                  type="submit"
                  fluid
                />

                <Button
                  onClick={() => setDeleteConfirmShow(true)}
                  loading={warehouseStore.isDeleting}
                  style={{ marginTop: 10 }}
                  content="Изтрий склад"
                  type="button"
                  color="red"
                  fluid
                />
                <Button
                  onClick={modalStore.closeModal}
                  style={{ marginTop: 10 }}
                  content="Откажи редакция"
                  type="button"
                  color="grey"
                  fluid
                />
              </div>
            </Form>
            <Confirm
              open={deleteConfirmShow}
              onConfirm={() => {
                deleteWarehouse(warehouseData.id);
                setDeleteConfirmShow(false);
              }}
              onCancel={() => setDeleteConfirmShow(false)}
              content="Сигурни ли сте, че искате да изтриете склад ?"
              confirmButton="Изтрий"
              cancelButton="Отказ"
            />
          </>
        );
      }}
    </Formik>
  );
});
