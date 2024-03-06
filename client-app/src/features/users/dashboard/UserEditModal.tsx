import { Form, Formik } from "formik"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { Button } from "semantic-ui-react"
import MySelectInput from "../../../app/common/form/MySelectInput"
import MyTextArea from "../../../app/common/form/MyTextArea"
import MyTextInput from "../../../app/common/form/MyTextInput"
import { UserInfo } from "../../../app/models/user"
import { useStore } from "../../../app/stores/store"

interface Props {
    user: UserInfo
}

export default observer(function UserEditModal(props: Props) {
    const { modalStore, commonStore, roleStore, profileStore: { updateProfile } } = useStore();

    const { roleRegistry, loadRoles, roleOptions } = roleStore;

    useEffect(() => {
        if (roleRegistry.size < 1) loadRoles();
    }, [loadRoles, roleRegistry.size])


    function handleUpdateProfile(updatedUser: UserInfo) {
        updateProfile(updatedUser).then(() => {
            modalStore.closeModals('userEditModal');
        }).catch(error => {
            console.log(error);
        })
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
                            <h1>Редактиране на потребител</h1>
                        </div>
                        <div className="user-edit-form-body" style={{ padding: '30px 0' }}>
                            <MyTextInput label="Име" name="displayName" placeholder="Име" />
                            <MyTextInput label="Имейл" name="email" placeholder="Имейл" />
                            <MyTextInput label="Телефонен номер" name="phoneNumber" placeholder="Телефонен номер" />
                            <MyTextInput label="Парола" name="password" placeholder="Парола" />
                            <MySelectInput label="Роля" name="role" placeholder="" options={roleOptions} />
                            <MyTextArea rows={6} name="bio" label="Биография" placeholder="Биография" value={values.bio === null ? "" : values.bio} />
                        </div>
                        <div className="user-edit-form-footer" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Button onClick={() => modalStore.closeModals('userEditModal')} color="red" content="Отказ" />
                            <Button type="submit" disabled={isSubmitting || !dirty || !isValid} loading={isSubmitting} color="green" content="Запази" />
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
})