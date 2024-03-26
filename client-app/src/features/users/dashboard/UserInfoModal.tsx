import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Header, Select } from "semantic-ui-react";
import { UserInfo } from "../../../app/models/user";
import { useStore } from "../../../app/stores/store";
import ProfileOrders from "../../profile/ProfileOrders";
import TextField from "../../profile/TextField";

interface Props {
    user: UserInfo
}

export default observer(function UserInfoModal(props: Props) {
    const { modalStore, orderStore: { clearPagedOrderRegistry } } = useStore();
    const location = useLocation();
    const isUsersRoute = location.pathname === '/users';

    const [activeTab, setActiveTab] = useState("1");

    useEffect(() => {
        if (activeTab === "2") {
            clearPagedOrderRegistry();
        }
    }, [activeTab, clearPagedOrderRegistry]);

    return (
        <>
            {isUsersRoute && (
                <Header as="h2" content={`Информация за ${props.user.displayName}`} />
            )}
            <Select
                options={[
                    { key: "1", value: "1", text: "Обща информация" },
                    { key: "2", value: "2", text: "Завършени поръчки" },
                ]}
                onChange={(_, data) => {
                    setActiveTab(data.value as string);
                }}
                defaultValue={activeTab}
            />
            {
                activeTab === "1" ? (
                    <>
                        <TextField label="Име" value={props.user.displayName || ""} name="displayName" />
                        <TextField label="Потребителско име" value={props.user.userName || ""} name="userName" />
                        <TextField label="Имейл" value={props.user.email || ""} name="email" />
                        <TextField label="Телефон" value={props.user.phoneNumber || ""} name="phoneNumber" />
                        <TextField label="Роля" value={props.user.role || ""} name="role" />
                        <TextField label="Биография" value={props.user.bio || ""} name="bio" bigger={true} rows={5} />
                    </>
                ) : activeTab === "2" &&
                <ProfileOrders displayName={props.user.displayName} />
            }
            {
                isUsersRoute && (
                    <>
                        <Button
                            onClick={() => modalStore.closeModals('userInfoModal')}
                            content="OK"
                            type="button"
                            floated="right"
                            inverted
                            color="green"
                            style={{ marginBottom: "20px" }}
                        />
                    </>
                )
            }
        </>
    )
});