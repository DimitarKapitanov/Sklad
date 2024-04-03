import { FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Button, FormGroup, Table } from "semantic-ui-react";
import MyCustomInput from "../../../app/common/form/MyCustomInput";
import ProductSelect from "../../../app/common/form/ProductSelect";
import DataTable from "../../../app/common/table/DataTable";
import { orderProductTableHeader } from "../../../app/common/tableHeaders/tableHeaderProduct";
import { OrderFormValues } from "../../../app/models/order";
import { OrderProduct } from "../../../app/models/orderProduct";
import { useStore } from "../../../app/stores/store";

interface Props {
    formikProps: FormikProps<{ newOrder: OrderFormValues; product: OrderProduct; }>
}

export default observer(function TestOrderProductTable({ formikProps }: Props) {
    const { commonStore: { mapToSelectOptions }, productStore } = useStore();
    const { loadProducts, productOptions, orderSelectedProduct, loadProductFromOrder } = productStore;

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const removeOrderProduct = (id: string) => {
        formikProps.setFieldValue(
            'newOrder.orderProducts',
            formikProps.values.newOrder.orderProducts.filter(op => op.id !== id)
        );
    }

    function addOrderProduct() {
        const updatedProducts = formikProps.values.newOrder.orderProducts.map(product =>
            product.productId === formikProps.values.product.productId
                ? { ...product, quantity: Number(product.quantity) + Number(formikProps.values.product.quantity), price: formikProps.values.product.price }
                : product
        );
        console.log(updatedProducts);

        if (!updatedProducts.find(product => product.productId === formikProps.values.product.productId)) {
            updatedProducts.push(formikProps.values.product);
        }

        formikProps.setFieldValue('newOrder.orderProducts', updatedProducts);
        formikProps.setFieldValue('product', { productId: '', price: '', quantity: '' });
    }

    return (
        <>
            <DataTable header={orderProductTableHeader}>
                {formikProps.values.newOrder.orderProducts.map((orderProduct, index) => (
                    <Table.Row key={index}>
                        <Table.Cell content={orderProduct.name} />
                        <Table.Cell content={orderProduct.unitAcronym} />
                        <Table.Cell content={orderProduct.categoryName} />
                        <Table.Cell content={orderProduct.quantity} />
                        <Table.Cell content={orderProduct.price} />
                        <Table.Cell content={(orderProduct.price * orderProduct.quantity)} />
                        <Table.Cell>
                            <Button
                                type="button"
                                color="red"
                                icon="trash"
                                compact
                                onClick={() => removeOrderProduct(orderProduct.id)}
                            />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </DataTable>
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
                    <ProductSelect
                        formikProps={formikProps}
                        productOptions={productOptions}
                        loadProducts={loadProducts}
                        mapToSelectOptions={mapToSelectOptions}
                        loadProductFromOrder={loadProductFromOrder}
                    />
                </FormGroup>
                <MyCustomInput
                    placeholder="Цена"
                    name="product.price"
                    label="Цена"
                />
                <MyCustomInput
                    placeholder="Количество"
                    label="Количество"
                    name="product.quantity"
                />
                <Button
                    content="Добави продукт"
                    type="button"
                    color="blue"
                    disabled={!orderSelectedProduct || !formikProps.dirty || !formikProps.isValid}
                    compact
                    style={{ height: 37, marginTop: 24 }}
                    onClick={addOrderProduct}
                />
            </FormGroup>
        </>
    )
});