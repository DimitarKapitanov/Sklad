import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

export default function NavBar() {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: "10px" }} />
                    Sklad
                </Menu.Item>
                <Menu.Item name="Products" />
                <Menu.Item>
                    <Button positive content="Create Product" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}