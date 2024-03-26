import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faMapPin, faPhone, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import { Warehouse } from "../../app/models/warehouse";

interface Props {
    profile: Profile;
    location: string;
    warehouse: Warehouse | null;
}

export default observer(function ProfileInfoCard(props: Props) {

    return (
        <div className="profile-card">
            <div className="first-section">
                <img className="profile-image" src={props.profile.image || "/assets/user.png"} alt="" />
                <div className="role">
                    <span className="name">{props.profile.displayName}</span>
                    <span className="position">{props.profile.role}</span>
                </div>

            </div>
            <div className="second-section">
                <div className="location">
                    <FontAwesomeIcon icon={faMapPin} />
                    <span className="location-text">{props.location}</span>
                </div>
                <div className="contact-box">
                    <FontAwesomeIcon icon={faPhone} />
                    <span className="contact-text">{props.profile.phoneNumber}</span>
                </div>
                <div className="contact-box">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span className="contact-text">{props.profile.email}</span>
                </div>
                <div className="warehouse">
                    <div className="warehouse-label">
                        <FontAwesomeIcon icon={faWarehouse} />
                        <span className="warehouse-label-text">{`Склад: ${props.warehouse?.name}`}</span>
                    </div>
                </div>
            </div>
        </div>
    )
})
