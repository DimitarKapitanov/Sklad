import { observer } from "mobx-react-lite";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import CheckBox from "../common/checkbox/CheckBox";
import { useStore } from "../stores/store";
import logo from "/assets/warehouse_logo.png";

const routes = [
  { path: "products", name: "Продукти" },
  { path: "statistics", name: "Статистика" },
  { path: "orders", name: "Поръчки" },
  { path: "warehouses", name: "Складове" },
  { path: "partners", name: "Партньори" },
  { path: "users", name: "Персонал" },
];

export default observer(function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const {
    userStore: { user, logout },
  } = useStore();

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  if (showNavbar) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }

  return (
    <nav>
      <img src={logo} className="logo" />
      <div>
        <CheckBox toggleFunc={handleShowNavbar} isOpen={showNavbar} />
      </div>

      <ul className={`menu ${showNavbar ? "active" : ""}`}>
        <div>
          {routes.map((route, index) => (
            <li key={index} onClick={handleShowNavbar}>
              <NavLink to={route.path}>{route.name}</NavLink>
            </li>
          ))}
        </div>
        <div>
          <li onClick={handleShowNavbar}>
            <NavLink to={`/profile/${user?.userName}`}>Моят профил</NavLink>
          </li>
          <li>
            <a onClick={logout} style={{ cursor: "pointer" }}>
              Изход
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
});
