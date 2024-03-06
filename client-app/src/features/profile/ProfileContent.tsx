import { observer } from "mobx-react-lite";
// import { useStore } from "../../app/stores/store";
import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import ProfileAbout from "./ProfileAbout";
import ProfileOrders from "./ProfileOrders";
import ProfilePhotos from "./ProfilePhotos";

interface Props {
    profile: Profile
}

export default observer(function ProfileContent({ profile }: Props) {
    // const { profileStore } = useStore();
    const panes = [
        { menuItem: 'Обща информация', render: () => <ProfileAbout profile={profile} /> },
        { menuItem: 'Снимки', render: () => <ProfilePhotos profile={profile} /> },
        { menuItem: 'Завършени поръчки', render: () => <ProfileOrders username={profile.username} /> },
    ];

    return (
        <Tab
            className="profile-info wrapped"
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
        // onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
        />
    )
})