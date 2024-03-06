import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
// import ValidationError from "../errors/ValidationError";
import MySelectInput from "../../app/common/form/MySelectInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { NewUserFormValues } from "../../app/models/user";

export default observer(function CreateUser() {
    const { userStore, commonStore: { createUserValidationSchema }, modalStore } = useStore();

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

    return (
        <Formik
            initialValues={newUser}
            onSubmit={(values) => createUser(values)}
            validationSchema={createUserValidationSchema}
        >
            {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off' style={{ padding: '20px' }}>
                    <Header as='h2' content='Регистрация на потребител' color='teal' textAlign='center' />
                    <MyTextInput placeholder="Имейл" name="email" label="Имейл*" />
                    <MyTextInput placeholder="Парола" name="password" type="password" label="Парола*" />
                    <MyTextInput placeholder="Име" name="displayName" label="Име*" />
                    <MyTextInput placeholder="Потребителско име" name="userName" label="Потребителско име*" />
                    <MyTextInput placeholder="Телефонен номер" name="phoneNumber" label="Телефонен номер*" />
                    <MyTextArea placeholder="Биография" label="Биография" name="bio" rows={3} />
                    <MySelectInput placeholder="Роля" label="Роля" name="role" options={[
                        { text: 'Служител', value: 'Employee' },
                        { text: 'Мениджър', value: 'Manager' },
                        { text: 'Администратор', value: 'Admin' }
                    ]} />
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