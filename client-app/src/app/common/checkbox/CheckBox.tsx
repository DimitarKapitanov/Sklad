import { observer } from "mobx-react-lite";
export default observer(function CheckBox({
  toggleFunc,
  isOpen,
}: {
  toggleFunc: () => void;
  isOpen: boolean;
}) {
  return (
    <>
      <input
        type="checkbox"
        id="navbar-checkbox"
        className={isOpen ? "toggle-active" : "toggle-inactive"}
        onClick={() => toggleFunc()}
      />
      <label htmlFor="navbar-checkbox" className="navbar-toggle">
        <div className="bars" id="bar1"></div>
        <div className="bars" id="bar2"></div>
        <div className="bars" id="bar3"></div>
      </label>
    </>
  );
});
