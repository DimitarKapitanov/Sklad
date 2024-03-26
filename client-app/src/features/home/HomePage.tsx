import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();

    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as="h1" inverted>
                    <Image size="massive" src="/assets/logo.png" alt="logo" style={{ marginBottom: 12 }} />
                    Склад
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header as="h2" inverted content="Добре дошли в Склад" />
                        <Button as={Link} to={userStore.user?.role.includes('Admin') || userStore.user?.role.includes('Manager') ? '/products' : '/orders'} size="huge" inverted>
                            {userStore.user?.role.includes('Admin') || userStore.user?.role.includes('Manager') ? 'Към продуктите' : 'Към поръчките'}
                        </Button>
                    </>

                ) : (
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm />, 'mini')} size="huge" inverted>
                            Влез
                        </Button>
                    </>
                )}
            </Container>
        </Segment>
    )
})