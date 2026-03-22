import { observer } from "mobx-react-lite";
import { Fragment, useState } from "react";
import { Button, Pagination, PaginationProps, Segment, Table } from "semantic-ui-react";
import DataTable from "../../../app/common/table/DataTable";
import { tableHeaderSoldProducts } from "../../../app/common/tableHeaders/tableHeaderSoldProducts";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import ProductInfoTable from "./ProductInfoTable";

export default observer(function SoldProductsTable() {
  const { statisticsStore } = useStore();
  const { soldProductSort, formatDateTime, pagination, setPagingParams, loadSoldProducts: loadSoldProducts } = statisticsStore;
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [showInfoTable, setShowInfoTable] = useState(false);

  function handleClick(index: number): void {
    if (soldProductSort) {
      const soldProducts = soldProductSort[index];
      if (soldProducts && soldProducts.orderProductDtos) {
        const firstOrderProduct = soldProducts.orderProductDtos;
        if (selectedOrderId !== firstOrderProduct[0].orderId) {
          setShowInfoTable(true);
        } else setShowInfoTable(!showInfoTable);
        setSelectedOrderId(firstOrderProduct[0].orderId);
      }
    }
  }

  function handlePageChange(
    _: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps
  ) {
    const activePage = data.activePage as number;
    setPagingParams(new PagingParams(activePage));
    loadSoldProducts();
  }

  return (
    <Segment style={{ overflowX: "auto" }}>
      <DataTable header={tableHeaderSoldProducts}>
        {soldProductSort && soldProductSort.map((soldProduct, index) => (
          <Fragment key={index}>
            <Table.Row key={index}>
              <Table.Cell content={soldProduct.partnerName} />
              <Table.Cell>{soldProduct.companyOwnerName}</Table.Cell>
              <Table.Cell>{formatDateTime(soldProduct.createdOn)}</Table.Cell>
              <Table.Cell>{formatDateTime(soldProduct.completedDate)}</Table.Cell>
              <Table.Cell>{soldProduct.email}</Table.Cell>
              <Table.Cell>{soldProduct.phone}</Table.Cell>
              <Table.Cell>{soldProduct.bulstat}</Table.Cell>
              <Table.Cell>{"гр." + " " + soldProduct.deliveryCity + " " + "ул." + soldProduct.deliveryAddress}</Table.Cell>
              <Table.Cell>{soldProduct.warehouseName}</Table.Cell>
              <Table.Cell textAlign="center">
                <Button primary size="mini" compact icon="info" onClick={() => handleClick(index)} />
              </Table.Cell>
            </Table.Row>
            {showInfoTable &&
              selectedOrderId === soldProduct.orderProductDtos[0]?.orderId ? (
              <Table.Row>
                <Table.Cell colSpan={tableHeaderSoldProducts.length + 1}>
                  <ProductInfoTable order={soldProductSort[index].orderProductDtos} />
                </Table.Cell>
              </Table.Row>
            ) : (
              ""
            )}
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
