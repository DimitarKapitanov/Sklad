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
                <Menu.Item as={NavLink} to='products' name="Products" content="Продукти" />
                <Menu.Item>
                    <Button as={NavLink} to='/createProduct' positive content="Създай продукт" />
                </Menu.Item>
                <Menu.Item>
                    <Button as={NavLink} to='/createUnit' positive content="Създай единица" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}