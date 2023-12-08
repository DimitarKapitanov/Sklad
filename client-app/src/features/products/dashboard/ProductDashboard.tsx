import { Grid, } from "semantic-ui-react";
import ProductTable from "./ProductTable";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ProductFilters from "./ProductFilters";

export default observer(function ProductDashboard() {
    const { productStore } = useStore();
    const { loadProducts, productRegistry } = productStore;

    useEffect(() => {
        if (productRegistry.size <= 1) loadProducts();
    }, [loadProducts, productRegistry.size])


    if (productStore.loadingInitial) return <LoadingComponent content='Зареждане...' />

    return (
        <>
            <Grid style={{ marginLeft: '20px' }} >
                <Grid.Column width="12">
                    <ProductTable />
                </Grid.Column>
                <Grid.Column width="4">
                    <ProductFilters />
                </Grid.Column>
            </Grid>
        </>
    )
})
