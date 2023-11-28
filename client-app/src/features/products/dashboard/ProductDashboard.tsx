import { Grid, } from "semantic-ui-react";
import ProductTable from "./ProductTable";
import ProductDetails from "../details/ProductDetails";
import ProductForm from "../form/ProductForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function ProductDashboard() {

    const { productStore } = useStore();
    const { selectedProduct, editMode } = productStore;

    return (
        <>
            <Grid style={{ marginLeft: '20px' }} >
                <Grid.Column width="11">
                    <ProductTable />
                </Grid.Column>
                <Grid.Column width="5">
                    {selectedProduct && !editMode &&
                        <ProductDetails />
                    }
                    {editMode &&
                        <ProductForm />
                    }
                </Grid.Column>
            </Grid>
        </>
    )
})