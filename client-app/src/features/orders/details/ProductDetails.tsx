import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Container, Header } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import OrderPartnerInformation from "./OrderPartnerInformation";
import OrderTableList from "./OrderTableList";

interface Props {
    orderId?: string;
    modalName?: string;
}

export default observer(function ProductDetails({ orderId, modalName }: Props) {
    const { orderStore, modalStore, userStore: { user } } = useStore();
    const { selectedOrder: order, loadingDetails, loading, completeOrder, loadOrder } = orderStore;

    const { id } = useParams();

    useEffect(() => {
        if (orderId) {
            loadOrder(orderId);
        }
        else if (id) loadOrder(id);
    }, [orderId, loadOrder, id]);

    const [isEditClicked, setIsEditClicked] = useState(false);

    if (loadingDetails || !order || !order.id) return <LoadingComponent />;

    return (
        <Container style={{ marginTop: '7em', paddingBottom: '2em' }}>
            <Header as="h2" content={`Поръчка № ${order.orderNumber}`} />
            <OrderPartnerInformation order={order} />
            <Card fluid>
                <Card.Content style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} className="order-table-header">
                        <Card.Header as="h2">Продукти</Card.Header>
                        {!order.isCompleted && !orderId && (user?.role.includes("Admin") || user?.role.includes("Manager")) ? (
                            <Card.Header>
                                <Button
                                    icon='pencil'
                                    content={isEditClicked ? "Затвори" : "Промени"}
                                    color={!isEditClicked ? "yellow" : "red"}
                                    onClick={() => setIsEditClicked(!isEditClicked)}
                                />
                            </Card.Header>
                        ) : null}
                    </div>
                    <OrderTableList order={order} isEditClicked={isEditClicked} />
                </Card.Content>
                <Card.Content extra textAlign="right"
                >
                    <Button
                        onClick={() => completeOrder(order.id)}
                        loading={loading}
                        color={order.isCompleted ? "red" : "green"}
                        disabled={order.isCompleted || orderId ? true : false}
                        content={order.isCompleted ? "Приключена" : "Приключи"}
                    />
                    {orderId ? <Button
                        style={{ backgroundColor: '#EFD780' }}
                        onClick={() => modalStore.closeModals(modalName ? modalName : 'partnerOrdersDetailsModal')} content="Затвори" floated="right" /> :
                        <Button as={Link} to={`/orders`} content="Назад" />
                    }
                </Card.Content>
            </Card>
        </Container>
    )
})