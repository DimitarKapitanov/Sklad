import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid, Pagination, PaginationProps } from "semantic-ui-react";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import ProductTable from "./ProductTable";
import ProductsActions from "./ProductsActions";

export default observer(function ProductDashboard() {
  const { productStore } = useStore();
  const { loadProducts, productPagingRegistry, setPagingParams, pagination } =
    productStore;

  function handlePageChange(
    _: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps
  ) {
    const activePage = data.activePage as number;
    setPagingParams(new PagingParams(activePage));
    loadProducts();
  }

  useEffect(() => {
    if (productPagingRegistry.size < 1) loadProducts();
  }, [loadProducts, productPagingRegistry.size]);

  return (
    <>
      <ProductsActions />
      <Grid>
        <Grid.Row>
          <Grid.Column width="16" className="product-page">
            <ProductTable />
            {pagination && (
              <Pagination
                defaultActivePage={1}
                activePage={pagination.currentPage || 1}
                onPageChange={handlePageChange}
                totalPages={pagination.totalPages || 1}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid >
    </>
  );
});
