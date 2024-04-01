import { observer } from "mobx-react-lite";
import { Button, Table } from "semantic-ui-react";
import DataTable from "../../../app/common/table/DataTable";
import { tableHeaderPartner } from "../../../app/common/tableHeaders/tableHeaderPartner";
import { useStore } from "../../../app/stores/store";
import PartnerOrders from "../details/PartnerOrders";

export default observer(function PartnerDashboard() {
  const { partnerStore, modalStore: { openModals } } = useStore();
  const { partners } = partnerStore;

  return (
    <>
      <DataTable header={tableHeaderPartner}>
        {partners.map((partner, index) => (
          <Table.Row key={index}>
            <Table.Cell>{partner.name}</Table.Cell>
            <Table.Cell>{partner.city}</Table.Cell>
            <Table.Cell>{partner.address}</Table.Cell>
            <Table.Cell>{partner.bulstat}</Table.Cell>
            <Table.Cell>{partner.phone}</Table.Cell>
            <Table.Cell>{partner.email}</Table.Cell>
            <Table.Cell>{partner.companyOwnerName}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button
                primary
                onClick={() => openModals('partnerDetailsModal', <PartnerOrders partner={partner} />, 'large')}
                size="mini" icon='info' />
            </Table.Cell>
          </Table.Row>
        ))}
      </DataTable >
    </>
  )
});
