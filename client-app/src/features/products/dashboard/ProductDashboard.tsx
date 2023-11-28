import { Button, Grid, } from "semantic-ui-react";
import { Product } from "../../../app/models/product";
import ProductTable from "./ProductTable";
import ProductDetails from "../details/ProductDetails";
import ProductForm from "../form/ProductForm";

interface Props {
    products: Product[];
    selectedProduct: Product | undefined;
    selectProduct: (id: string) => void;
    cancelSelectProduct: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (product: Product) => void;
    deleteProduct: (id: string) => void;
    submitting: boolean;
    getAllProducts: () => void;
}

export default function ProductDashboard({ products, cancelSelectProduct, selectProduct, selectedProduct, editMode, closeForm, openForm, createOrEdit, deleteProduct, submitting, getAllProducts }: Props) {

    return (
        <>
            <Button content='Всички продукти' style={{ marginLeft: '35px', marginBottom: '20px' }} onClick={getAllProducts} />
            <Grid style={{ marginLeft: '20px' }} >
                <Grid.Column width="11">
                    <ProductTable
                        products={products}
                        selectProduct={selectProduct}
                        deleteProduct={deleteProduct}
                        submitting={submitting}
                    />
                </Grid.Column>
                <Grid.Column width="5">
                    {selectedProduct && !editMode &&
                        <ProductDetails
                            product={selectedProduct}
                            cancelSelectProduct={cancelSelectProduct}
                            openForm={openForm}
                        />
                    }
                    {editMode &&
                        <ProductForm closeForm={closeForm} product={selectedProduct} createOrEdit={createOrEdit} submitting={submitting} />
                    }
                </Grid.Column>
            </Grid>
        </>
    )
}