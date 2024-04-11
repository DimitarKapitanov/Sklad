import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import {
    Header,
    Input,
    Menu,
    MenuItem,
    Select
} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function StatisticActions() {
    const { warehouseStore: { wareHouseOptions }, statisticsStore, supplierStore } = useStore();
    const { predicate, setPredicate } = statisticsStore;

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "40px"
                }}
            >
                <Header as="h2" content="Статистики" />
                {/* To Do add export in excel */}
                {/* <MenuMenu position="right">
                    <MenuItem>
                        <Button
                            primary
                            onClick={() => {
                                navigate("/partners/create");
                            }}
                            content={"Изтегли в Excel"}
                        />
                    </MenuItem>
                </MenuMenu> */}
            </div>
            <Menu pointing secondary className="actions-sort">
                <MenuItem
                    active={predicate.has("sales")}
                    onClick={() => setPredicate("sales", "true")}
                    content={"Продажби"}
                />
                <MenuItem
                    active={predicate.has("deliveries")}
                    onClick={() => { supplierStore.setPredicate("deliveries", "true"); setPredicate("deliveries", "true") }}
                    content={"Доставки"}
                />
            </Menu>
            <Menu
                pointing
                secondary
                style={{ borderBottom: "none" }}
                className="actions-inputs statistics-filter"
            >
                <div className="search-warehouse-select">
                    <MenuItem className="custom-search">
                        <Input
                            className="icon"
                            icon="search"
                            placeholder="Търси..."
                            style={{ height: "38px", paddingLeft: "0" }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if (predicate.has("deliveries")) supplierStore.setPredicate("search", event.target.value);
                                setPredicate("search", event.target.value);
                            }}
                        />
                    </MenuItem>
                    {predicate.has("sales") && (
                        <MenuItem style={{ height: "50px" }}>
                            <Select
                                className="warehouse-select"
                                clearable
                                placeholder="Склад"
                                options={wareHouseOptions}
                                value={predicate.get("warehouseId")}
                                onChange={(_, data) => {
                                    if (data.value === "") {
                                        predicate.delete("warehouseId");
                                    } else setPredicate("warehouseId", data.value as string);
                                }}
                            />
                        </MenuItem>
                    )}

                </div>
                {predicate.has("sales") && (
                    <div className="date-selectors">
                        <MenuItem style={{ height: "45px" }}>
                            <DatePicker
                                selected={predicate.get("startDate")}
                                onChange={(date) => {
                                    setPredicate("startDate", date as Date);
                                }}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Начална дата"
                                isClearable
                            />
                        </MenuItem>
                        <MenuItem style={{ height: "45px" }}>
                            <DatePicker
                                selected={predicate.get("endDate")}
                                onChange={(date) => setPredicate("endDate", date as Date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Крайна дата"
                                isClearable
                            />
                        </MenuItem>
                    </div>
                )}
            </Menu>
        </>
    );
});
