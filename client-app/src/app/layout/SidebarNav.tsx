import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import {
  Button,
  Container,
  Dropdown,
  Icon,
  Image,
  Menu,
  MenuItem,
  Sidebar,
} from "semantic-ui-react";
import LoginForm from "../../features/users/LoginForm";
import { useStore } from "../stores/store";
interface Props {
  tokenValid: boolean;
}

export default observer(function SidebarNav(props: Props) {
  const {
    userStore: { user, logout },
    modalStore,
  } = useStore();

  return (
    <Sidebar
      as={Menu}
      animation="push"
      direction="left"
      icon="labeled"
      inverted
      vertical
      visible={true}
      className="navbar"
      size="small"
      width="thin"
    >
      <Menu.Item
        header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image src="/assets/logo.png" alt="logo" height={60} as={Link} size="tiny" to="/" />
      </Menu.Item>
      <Container>
        {(user?.role.includes("Admin") || user?.role.includes("Manager")) ? (
          <>
            <MenuItem as={NavLink} to="products" icon="boxes" name="Продукти" />
            <MenuItem
              as={NavLink}
              to="statistics"
              icon="signal"
              name="Статистика"
            />
            <MenuItem as={NavLink} to="partners" icon="users" name="Партньори" />
            <MenuItem as={NavLink} to="users" icon="address book" name="Персонал" />
          </>
        ) : null}
        <MenuItem
          as={NavLink}
          to="orders"
          icon="shipping fast"
          name="Поръчки"
        />
        <MenuItem
          as={NavLink}
          to="warehouses"
          icon="warehouse"
          name="Складове"
        />
      </Container>
      <Menu.Item
        className="navbar-footer"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
        }}
      >
        {props.tokenValid ? (
          <span>
            <Image
              src={user?.image || "/assets/user.png"}
              avatar
              spaced="right"
            />
            <Dropdown pointing="top right" text={user?.displayName}>
              <Dropdown.Menu style={{ right: -17 }}>
                <Dropdown.Item
                  as={NavLink}
                  to={`/profile/${user?.userName}`}
                  text="Профил"
                  icon="user"
                />
                <Dropdown.Item onClick={logout} text="Излез" icon="power" />
              </Dropdown.Menu>
            </Dropdown>
          </span>
        ) : (
          <Button
            color="green"
            onClick={() => {
              modalStore.openModal(<LoginForm />, "mini");
            }}
          >
            <Icon name="user" />
            Влез
          </Button>
        )}
      </Menu.Item>
    </Sidebar>
  );
});
