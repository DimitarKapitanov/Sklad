import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Header, Segment } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import MySelectInput from "../../../app/common/form/MySelectInput";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Product } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";
import ProductTable from "./ProductTable";

interface FormValues {
  products: Product[];
  deliveryCompany: string;
}

export default observer(function ProductForm() {
  const { productStore, commonStore, unitStore, supplierStore } = useStore();
  const { validationSchema } = commonStore;
  const { createProduct, loading, loadingInitial } = productStore;
  const { loadUnits, unitRegistry } = unitStore;
  const { loadSuppliers, supplierRegistry, getSuppliersOptions } =
    supplierStore;
  const navigate = useNavigate();
  const [products] = useState<Product[]>([
    {
      id: "",
      name: "",
      quantity: 0,
      deliveryPrice: 0,
      price: 0,
      category: "",
      unitId: "",
      unitAcronym: "",
      description: "",
      createdOn: new Date(),
      modifiedOn: new Date(),
      isDeleted: false,
      deletedOn: null,
      unitDto: { id: "", acronym: "" },
    },
  ]);

  useEffect(() => {
    if (unitRegistry.size <= 1) loadUnits();
  }, [loadUnits, unitRegistry.size]);

  useEffect(() => {
    if (supplierRegistry.size < 1) loadSuppliers();
  }, [loadSuppliers, supplierRegistry.size]);

  function handleProductSubmit(
    products: Product[],
    deliveryCompanyId: string
  ) {
    products.forEach((product) => { (product.id = uuid()); });
    createProduct(deliveryCompanyId, products)
      .then(() => navigate("/products"))
      .catch((error) => console.log(error));
  }

  if (loadingInitial) return <LoadingComponent content="Зареждане..." />;

  return (
    <>
      <Header as={"h2"} content="Създаване на продукти" />
      <Segment clearing >
        <Formik
          validationSchema={validationSchema}
          initialValues={{ products, deliveryCompany: "" } as FormValues}
          onSubmit={(values: FormValues) =>
            handleProductSubmit(values.products, values.deliveryCompany)
          }
        >
          {({
            values,
            handleSubmit,
            setFieldValue,
            isValid,
            isSubmitting,
            dirty,
          }) => (
            <Form
              className="ui form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              {values.deliveryCompany ? (
                <ProductTable values={values} setFieldValue={setFieldValue} />
              ) : (
                //to do add infinity scroll
                <MySelectInput
                  options={getSuppliersOptions}
                  placeholder="Доставчик"
                  label="Изберете доставчик"
                  name="deliveryCompany"
                />
              )}

              <ButtonGroup floated="right">
                <Button
                  as={Link}
                  to="/products"
                  color="red"
                  type="button"
                  content="Отказ"
                />
                <Button
                  disabled={isSubmitting || !dirty || !isValid}
                  loading={loading}
                  type="submit"
                  positive
                >
                  Изпрати
                </Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </Segment>
    </>
  );
});
