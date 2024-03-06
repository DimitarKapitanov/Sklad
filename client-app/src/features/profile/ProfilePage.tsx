import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileInfoCard from "./ProfileInfoCard";

export default observer(function ProfilePage() {
    const { username } = useParams<{ username: string }>();

    const { warehouseStore, profileStore } = useStore();

    const { loadProfile, loadingProfile, profile } = profileStore;
    const { wareHouseRegistry, loadWareHouses, wareHouseByUserName } = warehouseStore;

    useEffect(() => {
        if (username) loadProfile(username);
    }, [loadProfile, username]);

    useEffect(() => {
        if (wareHouseRegistry.size <= 1) loadWareHouses();
    }, [wareHouseRegistry.size, loadWareHouses]);

    // const [activeTab, setActiveTab] = useState("1");

    if (loadingProfile) return <LoadingComponent content="Зареждане на профила..." />

    return (
        <>
            <div className="profile-page">
                <Header content="Информация за профила" />
                <div className="content">
                    {profile &&
                        <>
                            <ProfileInfoCard
                                profile={profile!}
                                location="София, България"
                                warehouse={wareHouseByUserName(username)}
                            />
                            <ProfileContent profile={profile} />
                        </>
                    }
                </div>
            </div>
        </>
    )
})
