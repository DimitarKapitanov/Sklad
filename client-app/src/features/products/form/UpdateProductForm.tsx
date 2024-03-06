import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Header, Segment } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Product } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";
interface Props {
    id: string;
}
export default observer(function ProductForm({ id }: Props) {
    const { productStore, commonStore, modalStore } = useStore();
    const { updateProduct, loading, loadProduct, loadingInitial } = productStore;
    const { validationSchemaEdit } = commonStore;

    const [product, setProduct] = useState<Product>({
        id: '',
        name: '',
        quantity: 0,
        deliveryPrice: 0,
        price: 0,
        category: '',
        unitId: '',
        unitAcronym: '',
        description: '',
        createdOn: new Date(),
        modifiedOn: new Date(),
        isDeleted: false,
        deletedOn: null,
        unitDto: { id: '', acronym: '' },
        deliveryCompanyId: ''
    })

    useEffect(() => {
        if (id) loadProduct(id).then(product => setProduct(product!))
    }, [id, loadProduct]);

    function handleProductEditSubmit(product: Product) {
        updateProduct(product!).then(() => modalStore.closeModal());
    }

    if (loadingInitial) return <LoadingComponent content='Зареждане...' />

    return (
        <Container text>
            <Header as={'h2'} content='Промени продукт' color='teal' textAlign='center' />
            <Segment clearing size="small" >
                <Formik
                    validationSchema={validationSchemaEdit}
                    enableReinitialize
                    initialValues={product}
                    onSubmit={values => handleProductEditSubmit(values)}>
                    {({ handleSubmit }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                            <MyTextInput name='name' placeholder='Име' label='Име' />
                            <MyTextInput placeholder='Продажна цена' label='Продажна цена' name='price' />
                            <MyTextInput placeholder='Доставна цена' label='Доставна цена' name='deliveryPrice' />
                            <MyTextInput placeholder='Описание' label='Допълнително описание' name='description' />
                            <ButtonGroup floated="right" >
                                <Button loading={loading} type='submit' positive>Изпрати</Button>
                                <Button onClick={() => modalStore.closeModal()} color='red' type="button" content='Отказ' />
                            </ButtonGroup>
                        </Form>
                    )}
                </Formik>
            </Segment>
        </Container>
    )
})
