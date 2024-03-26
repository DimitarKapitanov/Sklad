import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import ProfileAbout from "./ProfileAbout";
import ProfileOrders from "./ProfileOrders";
import ProfilePhotos from "./ProfilePhotos";

interface Props {
    profile: Profile
}

export default observer(function ProfileContent({ profile }: Props) {
    const panes = [
        { menuItem: 'Обща информация', render: () => <ProfileAbout profile={profile} /> },
        { menuItem: 'Снимки', render: () => <ProfilePhotos profile={profile} />, className: "profile-photos" },
        { menuItem: 'Завършени поръчки', render: () => <ProfileOrders displayName={profile.displayName} /> },
    ];

    return (
        <Tab
            className="profile-info wrapped"
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
        />
    )
})