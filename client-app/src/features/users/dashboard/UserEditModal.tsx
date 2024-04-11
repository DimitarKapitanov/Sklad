import { Form, Formik } from "formik"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { Button } from "semantic-ui-react"
import MySelectInput from "../../../app/common/form/MySelectInput"
import MyTextArea from "../../../app/common/form/MyTextArea"
import MyTextInput from "../../../app/common/form/MyTextInput"
import { UserFormValues, UserInfo } from "../../../app/models/user"
import { useStore } from "../../../app/stores/store"

interface Props {
    user: UserInfo
}

export default observer(function UserEditModal(props: Props) {
    const { modalStore, commonStore, roleStore, userStore: { updateUser, loadingUsers } } = useStore();

    const { roleRegistry, loadRoles, roleOptions } = roleStore;

    useEffect(() => {
        if (roleRegistry.size < 1) loadRoles();
    }, [loadRoles, roleRegistry.size])

    function handleUpdateProfile(updatedUser: UserInfo) {
        updateUser(updatedUser as UserFormValues).then(() => {
            modalStore.closeModals('userEditModal');
        });
    }

    return (
        <>
            <Formik
                initialValues={props.user}
                onSubmit={(values) => handleUpdateProfile(values)}
                validationSchema={commonStore.userEditValidationSchema}
            >
                {({ values, handleSubmit, isSubmitting, isValid, dirty }) => (
                    <Form className="ui form user-edit-form" onSubmit={handleSubmit}>
                        <div className="user-edit-form-header">
                            <h1>Редактиране на служител</h1>
                        </div>
                        <div className="user-edit-form-body" style={{ padding: '30px 0' }}>
                            <MyTextInput label="Име" name="displayName" placeholder="Име" value={values.displayName} />
                            <MyTextInput label="Имейл" name="email" placeholder="Имейл" value={values.email} />
                            <MyTextInput label="Телефонен номер" name="phoneNumber" placeholder="Телефонен номер" value={values.phoneNumber || ''} />
                            <MyTextInput label="Парола" name="password" placeholder="Парола" />
                            <MySelectInput label="Роля" name="role" placeholder="" options={roleOptions} />
                            <MyTextArea rows={6} name="bio" label="Биография" placeholder="Биография" value={values.bio === null ? "" : values.bio} />
                        </div>
                        <div className="user-edit-form-footer" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Button onClick={() => modalStore.closeModals('userEditModal')} color="red" content="Отказ" />
                            <Button type="submit" disabled={isSubmitting || !dirty || !isValid} loading={loadingUsers} color="green" content="Запази" />
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
})