import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ProductTableList from "./ProductTableList";
import ProductsListItemPlaceholder from "./ProductsListItemPlaceholder";

export default observer(function ProductTable() {
  const { productStore } = useStore();
  const {
    tableHeader,
    sortProducts,
    sortCategory,
    sortDirection,
    filter,
    loadingInitial,
  } = productStore;
  const [localTableHeader, setLocalTableHeader] = useState(tableHeader);

  useEffect(() => {
    if (window.location.pathname === "/products") {
      setLocalTableHeader([
        ...tableHeader,
        { key: "isDeleted", label: "Действия" },
      ]);
    }
  }, [tableHeader]);

  return (
    <>
      <Table
        celled
        sortable
        selectable
        className="product-table"
        unstackable
      >
        <Table.Header>
          <Table.Row className="product-tale-head groupe-product">
            {localTableHeader.map((row) => {
              if (row.key === "isDeleted" && filter === 1) return null;
              return (
                <Table.HeaderCell
                  key={row.key}
                  onClick={() => {
                    if (row.key != "isDeleted") sortProducts(row.key);
                  }}
                  className="groupe-product"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {row.label}
                    {row.key === sortCategory ? (
                      sortDirection === "asc" ? (
                        <FontAwesomeIcon icon={faArrowUp} />
                      ) : (
                        <FontAwesomeIcon icon={faArrowDown} />
                      )
                    ) : null}
                  </div>
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Fragment>
          <Table.Body>
            {loadingInitial ? (
              <ProductsListItemPlaceholder />
            ) : (
              productStore.pagedGroupedProducts.map((products, index) => (
                <ProductTableList key={index} product={products} />
              ))
            )}
          </Table.Body>
        </Fragment>
      </Table>
    </>
  );
});
