import { FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Button, FormGroup, Table } from "semantic-ui-react";
import MyCustomInput from "../../../app/common/form/MyCustomInput";
import ProductSelect from "../../../app/common/form/ProductSelect";
import { orderProductTableHeader } from "../../../app/common/tableHeaders/tableHeaderProduct";
import { OrderFormValues } from "../../../app/models/order";
import { OrderProduct } from "../../../app/models/orderProduct";
import { store, useStore } from "../../../app/stores/store";


interface Props {
    formikProps: FormikProps<{ newOrder: OrderFormValues; product: OrderProduct; }>
}

export default observer(function TestOrderProductTable({ formikProps }: Props) {
    const { commonStore: { mapToSelectOptions }, productStore } = useStore();
    const { loadProducts, productOptions, getProductById, clearSelectedProduct, orderSelectedProduct } = productStore;

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        if (formikProps.values.product.productId) {
            const product = getProductById(formikProps.values.product.productId);
            if (product) {
                formikProps.values.product = product;
            }
            formikProps.setFieldValue('product.price', product?.price);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formikProps.setFieldValue, getProductById, formikProps.values.product.productId]);

    const removeOrderProduct = (id: string) => {
        formikProps.setFieldValue(
            'newOrder.orderProducts',
            formikProps.values.newOrder.orderProducts.filter(op => op.id !== id)
        );
    }

    function addOrderProduct() {
        const updatedProducts = formikProps.values.newOrder.orderProducts.map((product) =>
            product.productId === formikProps.values.product.productId
                ? {
                    ...product,
                    quantity: Number(product.quantity) + Number(formikProps.values.product.quantity),
                    price: formikProps.values.product.price,
                    totalPrice: (Number(product.quantity) + Number(formikProps.values.product.quantity)) * formikProps.values.product.price
                }
                : {
                    ...product,
                    totalPrice: product.quantity * product.price
                }
        );

        if (!updatedProducts.find(product => product.productId === formikProps.values.product.productId)) {
            updatedProducts.push({
                ...formikProps.values.product,
                totalPrice: formikProps.values.product.quantity * formikProps.values.product.price
            });
        }

        formikProps.setFieldValue('newOrder.orderProducts', updatedProducts);
        clearSelectedProduct();
        formikProps.setFieldValue('product', { productId: '', price: '0.00', quantity: 0 });
    }

    const total = formikProps.values.newOrder.orderProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const totalWithVAT = total * 1.2;

    return (
        <>
            <Table celled striped unstackable style={{ overflowX: "auto" }}>
                <Table.Header>
                    <Table.Row style={{ textAlign: 'center' }}>
                        {orderProductTableHeader.map((header) => (
                            <Table.HeaderCell key={header.key} className="groupe-product">{header.label}</Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {formikProps.values.newOrder.orderProducts.map((orderProduct, index) => (
                        <Table.Row key={index}>
                            <Table.Cell >
                                <Button
                                    type="button"
                                    color="red"
                                    icon="trash"
                                    compact
                                    onClick={() => removeOrderProduct(orderProduct.id)}
                                /><span style={{ marginLeft: '16px' }}>{orderProduct.name}</span> </Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }} content={orderProduct.categoryName} />
                            <Table.Cell style={{ textAlign: 'center' }} content={orderProduct.unitAcronym} />
                            <Table.Cell style={{ textAlign: 'center' }} content={`${orderProduct.quantity} ${orderProduct.unitAcronym}`} />
                            <Table.Cell style={{ textAlign: 'center' }} content={`${orderProduct.price} лв`} />
                            <Table.Cell style={{ textAlign: 'center' }} content={`${(orderProduct.price * orderProduct.quantity).toFixed(2)} лв.`} />
                        </Table.Row>
                    ))}
                </Table.Body>
                <Table.Footer>
                    <Table.Row style={{ borderBottom: 'none' }}>
                        <Table.HeaderCell colSpan="5" style={{ textAlign: 'end', }} content={'Общо'} />
                        <Table.HeaderCell colSpan="1" style={{ borderLeft: "none", textAlign: 'center' }} content={`${total.toFixed(2)} лв`} />
                    </Table.Row>
                    <Table.Row style={{ borderBottom: 'none' }}>
                        <Table.HeaderCell colSpan="5" style={{ textAlign: 'end', border: 'none' }} content={'Общо с ДДС'} />
                        <Table.HeaderCell colSpan="1" style={{ border: 'none', textAlign: 'center' }} content={`${totalWithVAT.toFixed(2)} лв`} />
                    </Table.Row>
                </Table.Footer>
            </Table>
            <FormGroup style={{ paddingBottom: "1vh" }} >
                <ProductSelect
                    name="product.productId"
                    placeholder="Избери продукт"
                    options={mapToSelectOptions(productOptions, "value", "text")}
                    label="Добави продукт"
                    onMenuScrollToBottom={() => {
                        store.productStore.pagingParams.pageNumber++;
                        productStore.loadProducts();
                    }}
                    value={orderSelectedProduct ? { value: orderSelectedProduct.productId, label: orderSelectedProduct.name, } : null}
                />
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
                    disabled={
                        !formikProps.values.product.productId ||
                        !formikProps.values.product.price ||
                        !formikProps.values.product.quantity ||
                        !!formikProps.errors.product ||
                        formikProps.values.product.quantity <= 0
                    }
                    compact
                    style={{ height: 37, marginTop: 24 }}
                    onClick={() => addOrderProduct()}
                />
            </FormGroup>
        </>
    )
});