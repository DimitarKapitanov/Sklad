import { useEffect, useState } from "react";
import { Button, ButtonGroup, FormGroup, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import { FieldArray, Form, Formik } from "formik";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import { Unit } from "../../../app/models/unit";
import { Product } from "../../../app/models/product";

export default observer(function ProductForm() {
    const { productStore, commonStore, unitStore } = useStore();
    const { createProduct, loading, loadProduct, loadingInitial } = productStore;
    const { validationSchema } = commonStore;
    const { loadUnits, unitRegistry, unitSort } = unitStore;
    useEffect(() => {
        if (unitRegistry.size <= 1) loadUnits();
    }, [unitRegistry.size, loadUnits]);

    const unitOptions = unitSort.map((unit: Unit) => ({ text: unit.acronym!, value: unit.acronym!, key: unit.id! }));

    const navigate = useNavigate();
    const { id } = useParams();

    const [products, setProducts] = useState<Product[]>([{
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
        unit: { id: '', acronym: '' }
    }]);

    const product: Product = {
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
        unit: { id: '', acronym: '' }
    };
   
    useEffect(() => {
        if (id) loadProduct(id).then(product => setProducts(products => [...products, product!]))
    }, [id, loadProduct]);

    function handleProductSubmit(products: Product[]) {
        products.forEach(product => { product.id = uuid() });
        createProduct(products).then(() => navigate('/products'));
    }

    const handleUnitChange = (option: { text: string; value: string; key?: string | undefined; }, index: number, setFieldValue: (field: string, value: string) => void) => {
        if (option.key !== undefined) {
            setFieldValue(`products[${index}].unitId`, option.key);
            setFieldValue(`products[${index}].unit.id`, option.key);
            setFieldValue(`products[${index}].unit.acronym`, option.value);
        }
    };

    if (loadingInitial) return <LoadingComponent content='Зареждане...' />

    return (
        <Segment clearing>
            <Header content='Създай продукти' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                initialValues={{ products }}
                onSubmit={values => handleProductSubmit(values.products)}
            >
                {({ values, handleSubmit, setFieldValue, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <FieldArray name="products" >
                            {({ push, remove }) => (
                                <>
                                    {values.products.map((_, index) => (
                                        <FormGroup key={index} inline widths='equal' style={{ height: '100px' }} >
                                            <MyTextInput
                                                placeholder='Име' label='Име' name={`products[${index}].name`} />
                                            <MySelectInput
                                                options={categoryOptions}
                                                placeholder='Категория' label='Категория' name={`products[${index}].category`} />
                                            <MySelectInput
                                                onSelected={(option) => handleUnitChange(option, index, setFieldValue)}
                                                options={unitOptions}
                                                placeholder='Мярка' label='Мярка' name={`products[${index}].unitAcronym`} />
                                            <MyTextInput placeholder='Количество' label='Количество' name={`products[${index}].quantity`} />
                                            <MyTextInput placeholder='Продажна цена' label='Продажна цена' name={`products[${index}].price`} />
                                            <MyTextInput placeholder='Доставна цена' label='Доставна цена' name={`products[${index}].deliveryPrice`} />
                                            <MyTextArea rows={3} placeholder='Описание' label='Oписание' name={`products[${index}].description`} />
                                        </FormGroup>
                                    ))}
                                    <ButtonGroup floated="left" >
                                        <Button positive content='Добави ред' onClick={(e) => { e.preventDefault(); push(product); }} />
                                        <Button content='Изтрий' onClick={(e) => { e.preventDefault(), remove(values.products.length - 1); }} />
                                    </ButtonGroup>
                                </>
                            )}
                        </FieldArray>
                        <ButtonGroup floated="right" >
                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={loading}
                                type='submit'
                                positive>Изпрати</Button>
                            <Button as={Link} to='/products' color='red' type="button" content='Отказ' />
                        </ButtonGroup>
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})
