import { Menu, Container, Button } from "semantic-ui-react";
import { useStore } from "../stores/store";

export default function NavBar() {
    const {productStore} = useStore();
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: "10px" }} />
                    Sklad
                </Menu.Item>
                <Menu.Item name="Products" />
                <Menu.Item>
                    <Button onClick={() => productStore.openForm()} positive content="Create Product" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}