import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, FormGroup, Header, Segment } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { OrderFormValues } from "../../../app/models/order";
import { OrderProduct } from "../../../app/models/orderProduct";
import { useStore } from "../../../app/stores/store";
import CustomReactSelect from "../../orders/form/CustomSelect";
import TestOrderProductTable from "./TestOrderProductTable";

export default observer(function TestOrderForm() {
    const { orderStore, partnerStore, warehouseStore, commonStore: { mapToSelectOptions } } = useStore();

    const { createOrder, cancelOrder, loading } = orderStore;
    const { loadPartners, selectedPartner, partnerOptions, setPrimaryPredicate } = partnerStore;
    const { wareHouseOptions, loadWareHouses } = warehouseStore;

    // const navigate = useNavigate();

    // const [errors, setErrors] = useState(null);

    useEffect(() => {
        setPrimaryPredicate("isClient", "true");
        loadPartners();
    }, [loadPartners, setPrimaryPredicate]);

    useEffect(() => {
        loadWareHouses();
    }, [loadWareHouses]);

    const [newOrder] = useState<OrderFormValues>({
        id: "",
        partnerId: "",
        deliveryAddressId: '',
        warehouseId: "",
        createdBy: "",
        orderProducts: [],
    });

    const [product] = useState<OrderProduct>({
        id: '',
        orderId: '',
        productId: '',
        name: '',
        categoryId: '',
        categoryName: '',
        quantity: 0,
        unitId: '',
        unitAcronym: '',
        description: '',
        price: 0,
        totalPrice: 0,
    });

    function handleOrderSubmit(values: OrderFormValues) {
        values.id = uuid();

        createOrder(values)
        // .then((orderId) => {
        //     navigate(`/orders/${orderId}`);
        //     setErrors(null);
        // })
        // .catch((error) => {
        //     setErrors(error);
        //     setTimeout(() => {
        //         setErrors(null); // Изчистване на грешките след 20 секунди
        //     }, 20000);
        //     console.log(errors);
        // });
    }
    return (
        <Container>
            <Header as='h2' content='Test Order Form' color='teal' textAlign='center' />
            <Segment clearing size='large'>
                <Formik
                    initialValues={{ newOrder, product }}
                    enableReinitialize
                    onSubmit={(values) => handleOrderSubmit(values.newOrder)}
                >
                    {(props) => (
                        <Form className='ui form' onSubmit={props.handleSubmit}>
                            <FormGroup>
                                <CustomReactSelect
                                    name="newOrder.partnerId"
                                    placeholder="Избери партньор"
                                    options={mapToSelectOptions(partnerOptions, "value", "text")}
                                    onMenuScrollToBottom={() => {
                                        partnerStore.pagingParams.pageNumber++;
                                        partnerStore.loadPartners();
                                    }}
                                />
                                {props.values.newOrder.partnerId && selectedPartner && (
                                    <MySelectInput
                                        placeholder="Адрес за доставка"
                                        name="newOrder.deliveryAddressId"
                                        options={selectedPartner.deliveryAddress.map((address) => ({
                                            text: address.address,
                                            value: address.id,
                                            label: address.city,
                                            key: address.id,
                                        }))}
                                    />
                                )}
                                <MySelectInput
                                    name="newOrder.warehouseId"
                                    placeholder="Склад"
                                    options={wareHouseOptions}
                                    onChange={(data) => props.setFieldValue('props.values.newOrder.warehouseId', data)}
                                />
                            </FormGroup>
                            {props.values.newOrder.partnerId && props.values.newOrder.deliveryAddressId && props.values.newOrder.warehouseId && (
                                <TestOrderProductTable formikProps={props} />
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-end",
                                    padding: "10px 0",
                                }}
                            >
                                <Button
                                    type="button"
                                    content="Отказ"
                                    color="red"
                                    onClick={() => cancelOrder()}
                                    as={Link}
                                    to="/orders"
                                />
                                <Button
                                    disabled={props.isSubmitting || !props.dirty || !props.isValid}
                                    loading={loading}
                                    type="submit"
                                    positive
                                    content="Създай"
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </Segment>
        </Container>
    );
});