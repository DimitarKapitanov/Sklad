import { observer } from "mobx-react-lite";
import { Card, Grid, Header } from "semantic-ui-react";
import { Order } from "../../../app/models/order";

interface Props {
    order: Order;
}

export default observer(function OrderPartnerInformation({ order }: Props) {
    return (
        <Grid columns='3' stretched >
            <Grid.Row className="order-information">
                <Grid.Column className="client-information">
                    <Card fluid>
                        <Card.Content>
                            <Header>Клиент:</Header>
                            <Card.Description style={{ marginTop: '1.5em' }}>
                                <Header as='h5'>Име: {order.partnerName}</Header>
                                <Header as='h5'>Булстат: {order.bulstat}</Header>
                                <Header as='h5'>МОЛ: {order.companyOwnerName}</Header>
                                <Header as='h5'>Адрес: {order.city}, {order.address}</Header>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Grid.Column>
                <Grid.Column className="base-info">
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>Допълнителна информация:</Card.Header>
                            <Card.Description style={{ marginTop: '1.5em' }}>
                                <Header as='h5'>Адрес на доставка: {order.deliveryAddress}</Header>
                                <Header as='h5'>Телефон: {order.phone}</Header>
                                <Header as='h5'>Имейл: {order.email}</Header>
                                <Header as='h5'>{order.isCompleted ? 'Поръчката е завършена.' : 'В процес на доставка!'}</Header>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Grid.Column>
                <Grid.Column className="more-information">
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>Склад:</Card.Header>
                            <Card.Description style={{ marginTop: '1.5em' }}>
                                <Header as='h5'>Име: {order.warehouseName}</Header>
                                <Header as='h5'>Отговорно лице: {order.contactPersonName}</Header>
                                <Header as='h5'>Телефон: {order.contactPersonPhoneNumber}</Header>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
})