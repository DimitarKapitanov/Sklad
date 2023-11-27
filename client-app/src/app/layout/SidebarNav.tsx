import { Icon, Menu, Sidebar } from "semantic-ui-react";

export default function SidebarNav() {
    return (
        <Sidebar.Pusher as={Menu} style={{ marginTop: '53px' }}
            fixed='left'
            icon='labeled'
            vertical
            visible="true"
            width='thin'
        >
            <Menu.Item as='a'>
                <Icon name='home' />
                Home
            </Menu.Item>
            <Menu.Item as='a'>
                <Icon name='gamepad' />
                Games
            </Menu.Item>
            <Menu.Item as='a'>
                <Icon name='camera' />
                Channels
            </Menu.Item>
        </Sidebar.Pusher>
    )
}