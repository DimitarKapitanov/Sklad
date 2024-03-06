import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Segment } from "semantic-ui-react";
import { Partner } from "../../../app/models/partner";
interface Props {
    partner: Partner;
}

export default observer(function PartnerInformation({ partner }: Props) {
    return (
        <Segment>
            <Grid columns={2} className="partner-information">
                <Grid.Column className="base-info">
                    <Card fluid style={{ height: '100%' }} >
                        <Card.Content>
                            <Card.Header content={`Основна информация`} />
                            <Header as='h5' content={`Име на фирмата: ${partner.name}`} />
                            <Header as='h5' content={`МОЛ: ${partner.companyOwnerName}`} />
                            <Header as='h5' content={`Булстат: ${partner.bulstat}`} />
                            <Header as='h5' content={`Град: ${partner.city}`} />
                            <Header as='h5' content={`Адрес: ${partner.address}`} />
                            <Header as='h5' content={`Телефон: ${partner.phone}`} />
                            <Header as='h5' content={`Имейл: ${partner.email}`} />
                        </Card.Content>
                    </Card>
                </Grid.Column>
                <Grid.Column className="more-information">
                    <Card fluid>
                        <Card.Content>
                            <Card.Header content={`Допълнителна информация:`} />
                            <Card.Description content={`Телефон: ${partner.phone}`} />
                            <Card.Description content={`Адрес на доставка`} />
                            {partner.deliveryAddress.map((address, index) => (
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
                <Button content='Редакция' icon='pencil' color='yellow' />
            </div>
        </Segment>
    )
})