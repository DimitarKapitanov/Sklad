import { observer } from "mobx-react-lite";
import { Button, Card, Container, Header, Table } from "semantic-ui-react";
import DataTable from "../../../app/common/table/DataTable";
import { productTableHeader } from "../../../app/common/tableHeaders/tableHeaderProduct";
import { DeliveredProductDto, Partner } from "../../../app/models/partner";
import { useStore } from "../../../app/stores/store";
import PartnerInformation from "./PartnerInformation";

interface Props {
  delivery: DeliveredProductDto[];
  partner: Partner;
}

export default observer(function PartnerDeliveryDetails({ delivery, partner }: Props) {
  const { modalStore: { closeModals } } = useStore();

  const totalPrice = () => {
    let total = 0;
    delivery.forEach(product => {
      total += product.price * product.quantity;
    })
    return total;
  }
  return (
    <Container style={{ marginTop: '40px', paddingBottom: '2em' }}>
      <Header as="h2" content={`Доставка`} />
      <PartnerInformation partner={partner} />
      <Card fluid>
        <Card.Content style={{ overflowX: 'auto' }}>
          <Header as="h2" content={`Доставени продукти`} />
          <DataTable header={productTableHeader}>
            {delivery.map((product, index) => (
              <Table.Row key={index} >
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>{product.unitAcronym}</Table.Cell>
                <Table.Cell>{product.quantity}</Table.Cell>
                <Table.Cell>{product.price.toFixed(4)} лв.</Table.Cell>
                <Table.Cell>{(product.quantity * product.price).toFixed(4)} лв.</Table.Cell>
                <Table.Cell textAlign='center' content={`${((product.quantity * product.price) * 0.2).toFixed(4)} лв.`} />
                <Table.Cell textAlign='center'>{((product.quantity * product.price) * 1.2).toFixed(4)} лв.</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row >
              <Table.Cell colSpan={'7'} textAlign='right' content='Всичко без ДДС' />
              <Table.Cell textAlign='center'>{(totalPrice()).toFixed(4)} лв.</Table.Cell>
            </Table.Row>
            <Table.Row >
              <Table.Cell colSpan={'7'} textAlign='right' content='ДДС 20%' />
              <Table.Cell textAlign='center'>{(totalPrice() * 0.2).toFixed(4)} лв.</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan={'7'} textAlign='right'>Общо с ДДС</Table.Cell>
              <Table.Cell textAlign='center'>{(totalPrice() * 1.2).toFixed(4)} лв.</Table.Cell>
            </Table.Row>
          </DataTable>
        </Card.Content>
        <Card.Content extra textAlign="right">
          <Button
            onClick={() => closeModals('partnerDeliveryDetailsModal')}
            content="Затвори"
          />
        </Card.Content>
      </Card>
    </Container>
  )
});