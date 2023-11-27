import { Grid, } from "semantic-ui-react";
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
}

export default function ProductDashboard({ products, cancelSelectProduct, selectProduct, selectedProduct, editMode, closeForm, openForm, createOrEdit, deleteProduct }: Props) {

    const tableHeader = ["Име", "Количество", "Доставна цена", "Продажна цена", "Категория", "Мярка", "Описание", "Edit/Delete"];

    return (
        <Grid style={{ marginLeft: '20px' }} >
            <Grid.Column width="11">
                <ProductTable
                    products={products}
                    tableHeader={tableHeader}
                    selectProduct={selectProduct}
                    deleteProduct={deleteProduct}
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
                    <ProductForm closeForm={closeForm} product={selectedProduct} createOrEdit={createOrEdit} />
                }
            </Grid.Column>
        </Grid>

    )
}