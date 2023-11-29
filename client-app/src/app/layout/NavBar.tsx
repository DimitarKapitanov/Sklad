import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: "10px" }} />
                    Sklad
                </Menu.Item>
                <Menu.Item as={NavLink} to='products' name="Products" />
                <Menu.Item>
                    <Button as={NavLink} to='/createProduct' positive content="Create Product" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}