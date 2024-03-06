import { observer } from "mobx-react-lite";
import { Fragment, useState } from "react";
import { Button, Pagination, PaginationProps, Segment, Table } from "semantic-ui-react";
import DataTable from "../../../app/common/table/DataTable";
import { tableHeaderDeliveredProductsTest } from "../../../app/common/tableHeaders/tableHeaderDeliveredProducts";
import { tableHeaderSoldProducts } from "../../../app/common/tableHeaders/tableHeaderSoldProducts";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import DeliveredProductsTable from "./DeliveredProductsTable";

export default observer(function DeliveriesTable() {
  const { statisticsStore, supplierStore } = useStore();
  const { deliveredProductSort, loadingDeliveredProducts, setSelectCompanyId } = statisticsStore;
  const { getSuppliers, pagination, loadSuppliers, setPagingParams } = supplierStore;

  const [isLoadedSelectedPartner, setIsLoadedSelectedPartner] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  function handleClick(id: string): void {
    setSelectCompanyId(id);
    if (selectedRow === id) {
      setIsLoadedSelectedPartner(false);
      setSelectedRow(null);
      setSelectCompanyId('');
    } else {
      setIsLoadedSelectedPartner(true);
      setSelectedRow(id);
      loadingDeliveredProducts(id);
    }
  }

  function handlePageChange(
    _: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps
  ) {
    const activePage = data.activePage as number;
    setPagingParams(new PagingParams(activePage));
    loadSuppliers();
  }

  return (
    <Segment style={{ overflowX: "auto" }}>
      <DataTable header={tableHeaderDeliveredProductsTest}>
        {getSuppliers && getSuppliers.map((delivery, index) => (
          <Fragment key={index}>
            <Table.Row key={index} className="unstackable">
              <Table.Cell>{delivery.name}</Table.Cell>
              <Table.Cell>{delivery.city}</Table.Cell>
              <Table.Cell>{delivery.address}</Table.Cell>
              <Table.Cell>{delivery.bulstat}</Table.Cell>
              <Table.Cell>{delivery.phone}</Table.Cell>
              <Table.Cell>{delivery.email}</Table.Cell>
              <Table.Cell>{delivery.companyOwnerName}</Table.Cell>
              <Table.Cell><Button color='blue' size="tiny" icon='info' onClick={() => handleClick(delivery.partnerId)} /></Table.Cell>
            </Table.Row>
            {isLoadedSelectedPartner && deliveredProductSort && selectedRow === delivery.partnerId ?
              <Table.Row>
                <Table.Cell colSpan={tableHeaderSoldProducts.length + 1}>
                  <DeliveredProductsTable id={delivery.partnerId} deliveries={deliveredProductSort} />
                </Table.Cell>
              </Table.Row>
              : ("")}
          </Fragment>
        ))}
      </DataTable>
      {pagination && (
        <Pagination
          defaultActivePage={1}
          activePage={pagination.currentPage || 1}
          onPageChange={handlePageChange}
          totalPages={pagination.totalPages || 1}
        />
      )}
    </Segment>
  );
});
