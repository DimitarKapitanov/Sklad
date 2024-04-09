import { Formik } from 'formik'
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import MyTextInput from '../../../app/common/form/MyTextInput'
import { OrderProduct, OrderProductEdit } from '../../../app/models/orderProduct'
import { useStore } from '../../../app/stores/store'

interface Props {
    orderProduct: OrderProduct,
    style?: React.CSSProperties
}
export default observer(function OrderProductEdit({ orderProduct, style }: Props) {
    const { orderStore, modalStore, productStore } = useStore();
    const { loading, updateOrderProduct } = orderStore;
    const { productRegistry, loadProduct, productAmount } = productStore;

    useEffect(() => {
        if (orderProduct.productId) {
            loadProduct(orderProduct.productId);
        }
    }, [orderProduct.productId, loadProduct, productRegistry]);

    const [product] = useState<OrderProductEdit>({
        id: orderProduct.id,
        orderId: orderProduct.orderId,
        productId: orderProduct.productId,
        quantity: orderProduct.quantity,
        price: orderProduct.price,
        totalPrice: orderProduct.totalPrice,
        modifiedOn: new Date(),
    })

    function handleSubmitProduct(values: OrderProductEdit) {
        values.totalPrice = Number((values.quantity * values.price).toFixed(4));
        updateOrderProduct(values).then(() => modalStore.closeModal());
    }

    return (
        <Formik
            initialValues={product}
            onSubmit={(values) => handleSubmitProduct(values)}
        >
            {({ values, handleSubmit }) => (
                <Form className="ui form" style={style} onSubmit={handleSubmit} autoComplete='off'>
                    <Form.Input name='name' label='Име на продукта' placeholder='Име на продукта' value={orderProduct.name} disabled />
                    <Form.Input name='category' label='Категория' placeholder='Категория' value={orderProduct.categoryName} disabled />
                    <Form.Input name='unitAcronym' label='Мярка' placeholder='Мярка' value={orderProduct.unitAcronym} disabled />
                    <MyTextInput
                        name='quantity'
                        label='Количество'
                        placeholder='Количество'
                        type='number' min={0}
                        max={orderProduct.quantity + productAmount(values.productId)}
                        value={values.quantity}
                    />
                    <MyTextInput name='price' label='Цена' placeholder='Цена' type='number' min={0} step=".0000" value={values.price} />
                    <Form.Input
                        name='totalPrice'
                        label='Обща цена'
                        placeholder='Обща цена'
                        value={(values.quantity * values.price).toFixed(4)} disabled />
                    <Form.Input
                        name='totalPriceWithVat'
                        label='Обща цена с ДДС'
                        placeholder='Обща цена с ДДС'
                        value={((values.quantity * values.price) * 1.2).toFixed(4)} disabled
                        min={0}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button loading={loading} type='submit' positive>Изпрати</Button>
                        <Button onClick={() => modalStore.closeModal()} type='button' negative>Отказ</Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
})