import { Menu, Container, Button, Image, Dropdown } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
    const { userStore: { user, logout } } = useStore();

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
                    <Button as={NavLink} to='/errors' positive content="Errors" />
                </Menu.Item>
                <Menu.Item>
                    <Button as={NavLink} to='/createUnit' positive content="Създай единица" />
                </Menu.Item>
                <Menu.Item position='right'>
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={NavLink} to={`/profile/${user?.userName}`} text='Моят профил' icon='user' />
                            <Dropdown.Item onClick={logout} text='Излез' icon='power' />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
})