import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { Icon, Pagination, PaginationProps, Table } from "semantic-ui-react";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import OrderTableList from "./OrderTableList";

interface Props {
  id: string;
  activeIndex: string | null;
}

export default observer(function OrderTable({ id }: Props) {
  const { orderStore } = useStore();
  const {
    tableHeader,
    sortOrders,
    deleteOrder,
    sortCategory,
    sortDirection,
    filter,
    setPagingParams,
    loadOrdersByWarehouse,
    pagination,
    ordersByWarehouse,
  } = orderStore;

  function handlePageChange(
    _: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps
  ) {
    const activePage = data.activePage as number;
    setPagingParams(new PagingParams(activePage));
    loadOrdersByWarehouse(id);
  }

  useEffect(() => {
    if (id) loadOrdersByWarehouse(id);
  }, [id, loadOrdersByWarehouse]);

  return (
    <>
      <Table
        compact
        celled
        sortable
        selectable
        unstackable
        className="product-table"
      >
        <Table.Header>
          <Table.Row className="product-tale-head groupe-product">
            {tableHeader.map(
              (row) =>
                (row.key !== "isCompleted" || filter === 0) && (
                  <Table.HeaderCell
                    textAlign="center"
                    key={row.key}
                    onClick={() => sortOrders(row.key)}
                    className="groupe-product"
                  >
                    {row.label}
                    {sortCategory === row.key &&
                      (sortDirection === "asc" ? (
                        <Icon name="angle up"></Icon>
                      ) : (
                        <Icon name="angle down"></Icon>
                      ))}
                  </Table.HeaderCell>
                )
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ordersByWarehouse &&
            ordersByWarehouse?.map((order) => {
              return (
                <Fragment key={order.id}>
                  <OrderTableList
                    key={order.id}
                    order={order}
                    deleteOrder={deleteOrder}
                  />
                </Fragment>
              );
            })}
        </Table.Body>
        {pagination && (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="5">
                <Pagination
                  defaultActivePage={1}
                  activePage={pagination.currentPage || 1}
                  onPageChange={handlePageChange}
                  totalPages={pagination.totalPages || 1}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </>
  );
});
