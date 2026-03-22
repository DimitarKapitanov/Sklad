import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import PartnerEdit from "../partnerCreate/PartnerEdit";

export default observer(function PartnerInformation() {
    const { modalStore, partnerStore: { selectedPartner } } = useStore();
    return (
        <>
            {selectedPartner && (
                <Segment>
                    <Grid columns={2} className="partner-information">
                        <Grid.Column className="base-info">
                            <Card fluid style={{ height: '100%' }} >
                                <Card.Content>
                                    <Card.Header content={`Основна информация`} />
                                    <Header as='h5' content={`Име на фирмата: ${selectedPartner.name}`} />
                                    <Header as='h5' content={`МОЛ: ${selectedPartner.companyOwnerName}`} />
                                    <Header as='h5' content={`Булстат: ${selectedPartner.bulstat}`} />
                                    <Header as='h5' content={`Град: ${selectedPartner.city}`} />
                                    <Header as='h5' content={`Адрес: ${selectedPartner.address}`} />
                                    <Header as='h5' content={`Телефон: ${selectedPartner.phone}`} />
                                    <Header as='h5' content={`Имейл: ${selectedPartner.email}`} />
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column className="more-information">
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header content={`Допълнителна информация:`} />
                                    <Card.Description content={`Телефон: ${selectedPartner.phone}`} />
                                    <Card.Description content={`Адрес на доставка`} />
                                    {selectedPartner.deliveryAddress && selectedPartner.deliveryAddress.map((address, index) => (
                                        <div key={index}>
                                            <Card.Meta content={`Град: ${address.city}`} />
                                            <Card.Meta content={`Адрес: ${address.address}`} />
                                        </div>
                                    ))}
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid>
                    <div className="editing">
                        <Button content='Редакция' icon='pencil' color='yellow' onClick={() => modalStore.openModals('PartnerEdit', <PartnerEdit />, "mini")} />
                    </div>
                </Segment>
            )}
        </>
    )
})