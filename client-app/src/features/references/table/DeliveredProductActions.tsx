import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { Menu } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function DeliveredProductActions() {
    const { statisticsStore } = useStore();
    const { predicate, setPredicate } = statisticsStore;

    return (
        <Menu
            pointing
            secondary
            style={{ borderBottom: "none" }}
            className="actions-inputs statistics-filter"
        >
            <div className="date-selectors">
                <Menu.Item style={{ height: "45px" }}>
                    <DatePicker
                        selected={predicate.get("startDate")}
                        onChange={(date) => {
                            setPredicate("startDate", date as Date);
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Дата на доставка"
                        isClearable
                    />
                </Menu.Item>
            </div>
        </Menu>
    )
})