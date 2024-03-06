import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import {
  Button,
  ButtonGroup,
  Container,
  FormGroup,
  Header,
  Segment,
  Table,
} from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { NewOrder } from "../../../app/models/newOrder";
import { NewOrderProduct } from "../../../app/models/newOrderProduct";
import { store, useStore } from "../../../app/stores/store";
import ValidationErrors from "../../errors/ValidationError";

export default observer(function OrderForm() {
  const { orderStore, warehouseStore, partnerStore, commonStore } = useStore();
  const { orderCreateValidationSchema } = commonStore;

  const {
    loading,
    productOptions,
    selectProduct,
    selectedProduct,
    setProductAmount,
    cancelOrder,
    productPrice,
    productAmount,
    setProductPrice,
    addProduct,
    removeProduct,
    createOrder,
    clearSelectedProduct,
  } = orderStore;

  const {
    loadWareHouses,
    wareHouseOptions,
    selectWareHouse,
    selectWareHouseForOrder,
    wareHouseRegistry,
  } = warehouseStore;

  const {
    loadPartners,
    selectPartner,
    selectedPartner,
    partnerOptions,
    partnerRegistry,
  } = partnerStore;

  useEffect(() => {
    if (wareHouseRegistry.size <= 1) loadWareHouses();
  }, [loadWareHouses, wareHouseRegistry.size]);

  useEffect(() => {
    if (partnerRegistry.size <= 1) loadPartners();
  }, [loadPartners, partnerRegistry.size]);

  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const [orderProducts, setOrderProducts] = useState<NewOrderProduct[]>([]);

  const [data, setData] = useState<string>("");

  const newOrder: NewOrder = {
    id: "",
    isCompleted: false,
    completedDate: null,
    orderCreated: new Date(),
    partnerId: selectedPartner?.id || "",
    partnerName: selectedPartner?.name || "",
    city: selectedPartner?.city || "",
    companyOwnerName: selectedPartner?.companyOwnerName || "",
    email: selectedPartner?.email || "",
    phone: selectedPartner?.phone || "",
    address: selectedPartner?.address || "",
    vat: selectedPartner?.bulstat || "",
    deliveryAddress: selectedPartner?.deliveryAddress[0].address || "",
    warehouseId: selectWareHouseForOrder?.id || "",
    warehouseName: selectWareHouseForOrder?.name || "",
    contactPersonId: selectWareHouseForOrder?.contactPersonId || "",
    orderProductDto: [],
  };

  function handleOrderSubmit() {
    newOrder.id = uuid();
    newOrder.orderProductDto = orderProducts;
    newOrder.orderProductDto.forEach((orderProduct) => {
      orderProduct.id = uuid();
      orderProduct.orderId = newOrder.id;
    });

    createOrder(newOrder)
      .then((orderId) => {
        navigate(`/orders/${orderId}`);
        setErrors(null); // Изчистване на грешките при успешно създаване на поръчка
      })
      .catch((error) => {
        setErrors(error);
      });
  }

  const addOrderProduct = (selectedProduct: NewOrderProduct) => {
    const isAdded = addProduct(selectedProduct);
    if (!isAdded) return;
    setOrderProducts((prevOrderProducts) => {
      const existingProductIndex = prevOrderProducts.findIndex(
        (product) => product.id === selectedProduct.id
      );

      if (existingProductIndex !== -1) {
        const updatedProducts = [...prevOrderProducts];
        updatedProducts[existingProductIndex].quantity +=
          selectedProduct.quantity;
        updatedProducts[existingProductIndex].price = selectedProduct.price;
        updatedProducts[existingProductIndex].totalPrice =
          selectedProduct.price * selectedProduct.quantity;
        if (Number.isInteger(updatedProducts[existingProductIndex].quantity)) {
          updatedProducts[existingProductIndex].quantity = parseFloat(
            `${updatedProducts[existingProductIndex].quantity}.0000`
          );
        }
        return updatedProducts;
      } else {
        const newProduct = { ...selectedProduct };
        newProduct.totalPrice =
          selectedProduct.price * selectedProduct.quantity;
        if (Number.isInteger(newProduct.quantity)) {
          newProduct.quantity = parseFloat(`${newProduct.quantity}.0000`);
        }
        return [...prevOrderProducts, newProduct];
      }
    });
  };

  const removeOrderProduct = (productId: string) => {
    const productToRemove = orderProducts.find(
      (product) => product.id === productId
    );
    removeProduct(productId, productToRemove!);
    setOrderProducts((prevOrderProducts) => {
      return prevOrderProducts.filter((product) => product.id !== productId);
    });
  };
  const selectOptions = productOptions.map((product) => ({
    value: product.value,
    label: product.text,
  }));

  // add infinity scroll search functionality to get partners

  return (
    <Container>
      <Header as="h2" content="Създаване на поръчка" />
      <Segment>
        <Formik
          onSubmit={handleOrderSubmit}
          initialValues={{
            newOrder,
            product: { id: "", quantity: 0, price: 0 },
            orderProducts,
          }}
          validationSchema={orderCreateValidationSchema}
        >
          {({
            values,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            dirty,
            isValid,
            setValues,
          }) => (
            <Form
              className="ui form"
              onSubmit={handleSubmit}
              style={{ overflowX: "auto" }}
            >
              <FormGroup>
                <MySelectInput
                  name="partner"
                  placeholder="Компания"
                  options={partnerOptions}
                  onSelected={(data) =>
                    data.value && selectPartner(data.value.toString())
                  }
                />
                {selectedPartner && (
                  <MySelectInput
                    placeholder="Адрес за доставка"
                    name="deliveryAddress"
                    options={selectedPartner.deliveryAddress.map((address) => ({
                      text: address.address,
                      value: address.id,
                      label: address.city,
                      key: address.id,
                    }))}
                  />
                )}
                <MySelectInput
                  name="warehouse"
                  placeholder="Склад"
                  options={wareHouseOptions}
                  onSelected={(data) =>
                    data.value && selectWareHouse(data.value.toString())
                  }
                />
              </FormGroup>
              {selectedPartner &&
                selectedPartner.id &&
                selectWareHouseForOrder &&
                selectWareHouseForOrder.id && (
                  <>
                    <Table
                      celled
                      striped
                      unstackable
                      style={{ overflowX: "auto" }}
                    >
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Продукт</Table.HeaderCell>
                          <Table.HeaderCell>Мерна единица</Table.HeaderCell>
                          <Table.HeaderCell>Категория</Table.HeaderCell>
                          <Table.HeaderCell>Количество</Table.HeaderCell>
                          <Table.HeaderCell>Ед. цена</Table.HeaderCell>
                          <Table.HeaderCell>Общо</Table.HeaderCell>
                          <Table.HeaderCell>Действия</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {orderProducts.map((orderProduct, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>{orderProduct.name}</Table.Cell>
                            <Table.Cell>{orderProduct.unitAcronym}</Table.Cell>
                            <Table.Cell>{orderProduct.category}</Table.Cell>
                            <Table.Cell>{orderProduct.quantity}</Table.Cell>
                            <Table.Cell>{orderProduct.price}</Table.Cell>
                            <Table.Cell>
                              {parseFloat(
                                (
                                  orderProduct.price * orderProduct.quantity
                                ).toFixed(4)
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              <Button
                                type="button"
                                color="red"
                                icon="trash"
                                compact
                                onClick={() =>
                                  removeOrderProduct(orderProduct.id)
                                }
                              />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                      <Table.Footer>
                        <Table.Row>
                          <Table.HeaderCell colSpan="5">Общо</Table.HeaderCell>
                          <Table.HeaderCell>
                            {Array.from(orderProducts.values())
                              .reduce(
                                (sum, orderProduct) =>
                                  sum +
                                  orderProduct.price * orderProduct.quantity,
                                0
                              )
                              .toFixed(4)}
                          </Table.HeaderCell>
                          <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                          <Table.HeaderCell colSpan="5">
                            Общо с ДДС
                          </Table.HeaderCell>
                          <Table.HeaderCell>
                            {(
                              Array.from(orderProducts.values()).reduce(
                                (sum, orderProduct) =>
                                  sum +
                                  orderProduct.price * orderProduct.quantity,
                                0
                              ) * 1.2
                            ).toFixed(4)}
                          </Table.HeaderCell>
                          <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                      </Table.Footer>
                    </Table>
                    <FormGroup style={{ paddingBottom: "1vh" }}>
                      <FormGroup
                        className="ui grid"
                        style={{ flex: 1, flexFlow: "column" }}
                      >
                        <label
                          className="custom-label"
                          style={{ margin: "0 0 .28571429rem 0" }}
                        >
                          Добави продукт
                        </label>
                        <ReactSelect
                          className="ui dropdown"
                          name="product.id"
                          isClearable
                          value={
                            selectedProduct
                              ? {
                                  value: selectedProduct.id,
                                  label: selectedProduct.name,
                                }
                              : null
                          }
                          options={selectOptions}
                          pageSize={selectOptions.length}
                          placeholder="Въведете продукт"
                          onInputChange={(data) => {
                            if (data) {
                              orderStore.clearProductOptions();
                              store.productStore.pagingParams.pageNumber = 1;
                              orderStore.loadProducts(data);
                              setData(data);
                            }
                          }}
                          onChange={(data) => {
                            if (data) {
                              selectProduct((data as { value: string }).value);
                              values.product.id = (
                                data as { value: string }
                              ).value;
                              (data as { value: string }).value = "";
                              setData("");
                            }
                          }}
                          onMenuScrollToBottom={() => {
                            store.productStore.pagingParams.pageNumber++;
                            orderStore.loadProducts(data);
                          }}
                        />
                      </FormGroup>
                      <MyTextInput
                        placeholder="Цена"
                        label="Цена"
                        name="product.price"
                        type="number"
                        step="any"
                        value={productPrice.toString()}
                        min={selectedProduct?.price ? selectedProduct.price : 0}
                        onChange={(
                          data: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          if (selectedProduct) {
                            const price = parseFloat(data.target.value);
                            setProductPrice(price);
                            setFieldValue("product.price", price);
                            values.product.price = price;
                          }
                        }}
                      />
                      <MyTextInput
                        placeholder="Количество"
                        label="Количество"
                        name="product.quantity"
                        type="number"
                        step="any"
                        value={
                          Number.isInteger(productAmount)
                            ? `${productAmount}`
                            : productAmount.toString()
                        }
                        disabled={!selectedProduct}
                        max={selectedProduct?.quantity}
                        onChange={(data) => {
                          if (selectedProduct) {
                            const amount = parseFloat(data.target.value);
                            setProductAmount(amount);
                            setFieldValue("product.quantity", amount);
                            values.product.quantity = amount;
                          }
                        }}
                      />
                      <Button
                        content="Добави продукт"
                        type="button"
                        color="blue"
                        disabled={!selectedProduct || values.product.id === ""}
                        compact
                        style={{ height: 37, marginTop: 24 }}
                        onClick={() => {
                          addOrderProduct(selectedProduct!);
                          setValues((values) => ({
                            ...values,
                            product: { id: "", quantity: 1, price: 0 },
                          }));
                          store.productStore.pagingParams.pageNumber = 1;
                          orderStore.clearProductOptions();
                          clearSelectedProduct();
                        }}
                      />
                    </FormGroup>
                  </>
                )}
              <ButtonGroup
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "10px 0",
                }}
              >
                <Button
                  type="button"
                  content="Отказ"
                  color="red"
                  onClick={() => {
                    cancelOrder();
                  }}
                  as={Link}
                  to="/orders"
                />
                <Button
                  disabled={
                    isSubmitting ||
                    !dirty ||
                    !isValid ||
                    orderProducts.length === 0
                  }
                  loading={loading}
                  type="submit"
                  positive
                  content="Създай"
                />
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </Segment>
      {errors && <ValidationErrors errors={errors} />}
    </Container>
  );
});
