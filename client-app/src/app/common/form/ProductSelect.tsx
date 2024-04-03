import { FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import ReactSelect from 'react-select';
import { OrderFormValues } from '../../models/order';
import { OrderProduct } from '../../models/orderProduct';
import { store } from '../../stores/store';

interface Props {
    formikProps: FormikProps<{ newOrder: OrderFormValues; product: OrderProduct; }>
    productOptions: { key: string; text: string; value: string; }[];
    loadProducts: () => void;
    mapToSelectOptions: (items: { [key: string]: string; }[], valueKey: string, labelKey: string) => { value: string; label: string; }[]
    loadProductFromOrder: (productId: string) => Promise<OrderProduct | undefined>
}

const ProductSelect = observer(({ formikProps, productOptions, loadProducts, mapToSelectOptions, loadProductFromOrder }: Props) => {
    return (
        <ReactSelect
            className="ui dropdown"
            name="product.productId"
            isClearable
            noOptionsMessage={() => "Няма намерени продукти"}
            options={mapToSelectOptions(productOptions, "value", "text")}
            pageSize={productOptions.length}
            placeholder="Въведете продукт"
            value={formikProps.values.product.productId ? {
                value: formikProps.values.product.productId,
                label: formikProps.values.product.name
            } : null}
            onInputChange={(data) => {
                if (data) {
                    store.productStore.pagingParams.pageNumber = 1;
                    loadProducts();
                }
            }}
            onMenuScrollToBottom={() => {
                store.productStore.pagingParams.pageNumber++;
                loadProducts();
            }}
            onChange={async (option) => {
                if (option) {
                    const product = await loadProductFromOrder(option.value);
                    if (product) {
                        formikProps.setFieldValue('product', product);
                    }
                } else {
                    formikProps.setFieldValue('product', { productId: '', price: '', quantity: '' });
                }
            }}
        />
    );
});

export default ProductSelect;