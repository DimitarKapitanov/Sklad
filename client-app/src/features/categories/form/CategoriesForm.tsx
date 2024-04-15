import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Segment } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { Category } from "../../../app/models/category";
import { useStore } from "../../../app/stores/store";

export default observer(function CategoriesForm() {
    const { categoryStore: { loading, createCategory }, modalStore } = useStore();

    function handleCategorySubmit(values: Category) {
        createCategory(values).then(() => { modalStore.closeModal(); });
    }
    return (
        <Segment clearing>
            <Formik
                initialValues={{ name: '' }}
                onSubmit={(values) => handleCategorySubmit(values as unknown as Category)}
            >
                {({ handleSubmit }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Header content='Добави Категория' sub />
                        <MyTextInput name='name' placeholder='Категория' />
                        <Button
                            loading={loading}
                            floated='right'
                            positive
                            type='submit'
                            content='Добави'
                        />
                        <Button
                            floated='right'
                            type='button'
                            content='Откажи'
                            onClick={() => modalStore.closeModal()}
                        />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});