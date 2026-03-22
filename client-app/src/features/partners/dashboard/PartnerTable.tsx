import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "semantic-ui-react";
import DataTable from "../../../app/common/table/DataTable";
import { tableHeaderPartner } from "../../../app/common/tableHeaders/tableHeaderPartner";
import { useStore } from "../../../app/stores/store";

export default observer(function PartnerTable() {
  const { partnerStore } = useStore();
  const { partners, selectedPartner, clearSelectedPartner } = partnerStore;
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedPartner !== undefined) {
      clearSelectedPartner();
    }
  }, [selectedPartner, navigate, clearSelectedPartner]);

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
                onClick={() => {
                  navigate(`/partners/${partner.id}`);
                }}
                size="mini" icon='info' />
            </Table.Cell>
          </Table.Row>
        ))}
      </DataTable >
    </>
  )
});
