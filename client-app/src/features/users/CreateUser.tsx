import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, Header } from "semantic-ui-react";
import MySelectInput from "../../app/common/form/MySelectInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { NewUserFormValues } from "../../app/models/user";
import { useStore } from "../../app/stores/store";
import ValidationError from "../errors/ValidationError";

export default observer(function CreateUser() {
    const { userStore, commonStore: { createUserValidationSchema }, modalStore, roleStore: { roleOptions, loadRoles, roleRegistry } } = useStore();

    const { createUser, loadingUsers } = userStore;

    const newUser: NewUserFormValues = {
        displayName: '',
        userName: '',
        email: '',
        password: '',
        phoneNumber: '',
        bio: '',
        role: ''
    }

    useEffect(() => {
        if (roleRegistry.size < 1) loadRoles();
    }, [loadRoles, roleRegistry.size]);
    const [error, setError] = useState<string[] | null>(null);

    async function handleUserCreate(values: NewUserFormValues, { setFieldTouched }: FormikHelpers<NewUserFormValues>) {
        try {
            await createUser(values);
            modalStore.closeModal();
        } catch (error) {
            setError(error as string[] || null);
            // Mark all fields as touched to re-validate the form
            Object.keys(values).forEach(field => setFieldTouched(field));
        }
    }

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={newUser}
                onSubmit={handleUserCreate}
                validationSchema={createUserValidationSchema}
            >
                {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                    <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off' style={{ padding: '20px' }}>
                        <Header as='h2' content='Регистрация на служител' color='black' textAlign='center' />
                        <MyTextInput placeholder="Имейл" name="email" label="Имейл" required={true} />
                        <MyTextInput placeholder="Парола" name="password" type="password" label="Парола" required={true} />
                        <MyTextInput placeholder="Име на латиница/кирилица" name="displayName" label="Име" required={true} />
                        <MyTextInput placeholder="Потребителско име латиница" name="userName" label="Потребителско име" required={true} />
                        <MyTextInput placeholder="Телефонен номер" name="phoneNumber" label="Телефонен номер" required={true} />
                        <MyTextArea placeholder="Биография" label="Биография" name="bio" rows={3} />
                        <MySelectInput placeholder="Роля" label="Роля" name="role" required={true} options={roleOptions} />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <Button
                                disabled={!isValid || !dirty || isSubmitting}
                                loading={loadingUsers}
                                positive content="Регистрация"
                                type="submit"
                                floated="right"
                            />
                            <Button
                                content="Отказ"
                                type="button"
                                onClick={modalStore.closeModal}
                                floated="right"
                                inverted
                                color="red"
                            />
                        </div>
                    </Form>
                )}
            </Formik>
            {error && <ValidationError errors={error} />}
        </>
    )
})