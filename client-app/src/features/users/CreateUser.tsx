import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
// import ValidationError from "../errors/ValidationError";
import { useEffect } from "react";
import MySelectInput from "../../app/common/form/MySelectInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { NewUserFormValues } from "../../app/models/user";

export default observer(function CreateUser() {
    const { userStore, commonStore: { createUserValidationSchema }, modalStore, roleStore: { roleOptions, loadRoles, roleRegistry } } = useStore();

    const { createUser } = userStore;

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
    }, [loadRoles, roleRegistry.size])

    return (
        <Formik
            initialValues={newUser}
            onSubmit={(values) => createUser(values)}
            validationSchema={createUserValidationSchema}
        >
            {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off' style={{ padding: '20px' }}>
                    <Header as='h2' content='Регистрация на потребител' color='teal' textAlign='center' />
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
                            loading={isSubmitting}
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
    )
})