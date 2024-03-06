import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

export default function ProductFilters() {
  const navigate = useNavigate();
  return (
    <>

      <Menu vertical size="large" style={{ width: "100%" }}>
        <Header icon="pencil" attached color="teal" content="Действия" />
        <Menu.Item
          content="Създай продукт"
          onClick={() => {
            navigate("/ordersCreate");
          }}
        />
        <Menu.Item
          content="Създай единица"
          onClick={() => {
            navigate("/ordersCreate");
          }}
        />
      </Menu>
      <Menu vertical size="large" style={{ width: "100%" }}>
        <Header icon="filter" attached color="teal" content="Филтри" />
        <Menu.Item content="Всички продукти" />
        <Menu.Item content="Изтрити продукти" />
        <Menu.Item content="Продукти с най-малко количество" />
      </Menu>

      <Header />
      <Calendar />
    </>
  );
}
