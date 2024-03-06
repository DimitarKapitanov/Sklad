import { observer } from "mobx-react-lite";
import DatePicker from "react-datepicker";
import { Input, Menu } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function PartnerOrderActions() {
    const { partnerStore } = useStore();
    const { secondaryPredicate, setSecondaryPredicate, selectedPartner } = partnerStore;
    return (
        <>
            <Menu pointing secondary className="secondaryPredicate">
                <Menu.Item active={secondaryPredicate.has('allOrders')} onClick={() => setSecondaryPredicate('allOrders', 'true')} content={'Всички поръчки'} />
                {selectedPartner?.isClient &&
                    <>
                        <Menu.Item active={secondaryPredicate.has('isCompleted')} onClick={() => setSecondaryPredicate('isCompleted', 'true')} content={'Приключени'} />
                        <Menu.Item active={secondaryPredicate.has('isActive')} onClick={() => setSecondaryPredicate('isActive', 'true')} content={'Активни'} />
                    </>
                }
            </Menu>
            <div style={{ borderBottom: "none", display: 'flex', justifyContent: 'space-between' }} >
                <div className="date-search">
                    <Menu.Item style={{ height: "45px" }}>
                        <DatePicker
                            selected={secondaryPredicate.get("startDate")}
                            onChange={(date) => {
                                setSecondaryPredicate("startDate", date as Date);
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Начална дата"
                            isClearable
                        />
                    </Menu.Item>
                    <Menu.Item style={{ height: "45px" }}>
                        <DatePicker
                            selected={secondaryPredicate.get("endDate")}
                            onChange={(date) => setSecondaryPredicate("endDate", date as Date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Крайна дата"
                            isClearable
                        />
                    </Menu.Item>
                    <Menu.Item>
                        <Input
                            style={{ paddingTop: 0, paddingBottom: 0 }}
                            icon="search"
                            placeholder={selectedPartner?.isClient ? "Име на склада ..." : "Въвел ..."}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSecondaryPredicate("searchBy", event.target.value);
                            }}
                        />
                    </Menu.Item>
                </div>
            </div>
        </>
    )
})