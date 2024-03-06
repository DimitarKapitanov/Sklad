import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { Grid } from "semantic-ui-react"
import { Profile } from "../../app/models/profile"
import { useStore } from "../../app/stores/store"
import TextField from "./TextField"
interface Props {
    profile: Profile
}
export default observer(function ProfileAbout({ profile }: Props) {
    const { orderStore } = useStore();

    const { loadOrdersByUsername, orderRegistry, getOrderByUser } = orderStore;

    useEffect(() => {
        if (orderRegistry.size < 1) loadOrdersByUsername(profile.username);
    }, [loadOrdersByUsername, orderRegistry.size, profile.username])

    return (
        <>
            {profile &&
                <Grid stackable className="about-user wrapped">
                    <Grid.Row verticalAlign="middle" stretched style={{ justifyContent: "space-between" }}>
                        <Grid.Column style={{ width: "33.333%" }}>
                            <TextField label="Име" name="name" value={profile!.displayName || ""} />
                        </Grid.Column>
                        <Grid.Column style={{ width: "33.333%" }}>
                            <TextField label="Потребителско име" name="username" value={profile!.username || ""} />
                        </Grid.Column>
                        <Grid.Column style={{ width: "33.333%" }}>
                            <TextField label="Имейл" name="email" value={profile!.email || ""} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row verticalAlign="top" stretched style={{ justifyContent: "space-between" }}>
                        <Grid.Column style={{ width: "33.333%" }}>
                            <TextField label="Телефон" name="phone" value={profile!.phoneNumber || ""} />
                        </Grid.Column>
                        <Grid.Column style={{ width: "33.333%" }}>
                            <TextField label="Биография" name="bio" value={profile!.bio || ""} />
                        </Grid.Column>
                        <Grid.Column style={{ width: "33.333%" }}>
                            <TextField label="Доставени поръчки" name="delivery" value={getOrderByUser?.length.toString() || '0'} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            }
        </>
    )
})
