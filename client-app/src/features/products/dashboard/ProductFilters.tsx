import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";

export default function ProductFilters() {
    return (
        <>
            <Menu vertical size='large' style={{ width: '100%' }}>
                <Header icon='filter' attached color='teal' content='Филтри' />
                <Menu.Item content='Всички продукти' />
                <Menu.Item content="Изтрити продукти" />
                <Menu.Item content="Продукти с най-малко количество" />
            </Menu>
            <Header />
            <Calendar />
        </>
    )
}