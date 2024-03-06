import { observer } from "mobx-react-lite";
import { Button, Table } from "semantic-ui-react";
import DataTable from "../../../app/common/table/DataTable";
import { DeliveryAddress } from "../../../app/models/partner";


interface Props {
    deliveryAddresses: DeliveryAddress[];
    removeDeliveryAddress: (id: string) => void;
}

const tableHeaderDeliveryAddresses = [
    { key: 'city', label: 'Град' },
    { key: 'address', label: 'Адрес' },
    { key: 'actions', label: 'Действия' }
];

export default observer(function DeliveryAddressesTable(props: Props) {
    return (
        <DataTable header={tableHeaderDeliveryAddresses}  >

            {props.deliveryAddresses.map((deliveryAddress, index) => (
                <Table.Row key={index}>
                    <Table.Cell style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                        {deliveryAddress.city}
                    </Table.Cell>
                    <Table.Cell style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                        {deliveryAddress.address}
                    </Table.Cell>
                    <Table.Cell><Button icon="trash" color="red" onClick={() => props.removeDeliveryAddress(deliveryAddress.id)} /></Table.Cell>
                </Table.Row>
            ))}
        </DataTable>
    )
});