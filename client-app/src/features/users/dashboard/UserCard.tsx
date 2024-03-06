import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { Button } from "semantic-ui-react";
import { UserInfo } from "../../../app/models/user";
import { useStore } from "../../../app/stores/store";
import UserEditModal from "./UserEditModal";
import UserInfoModal from "./UserInfoModal";

interface Props {
  user: UserInfo;
}

export default observer(function UsersDashboard(props: Props) {
  const { modalStore } = useStore();
  const { openModals } = modalStore;

  return (
    <div className="user-card-body">
      <img src={props.user.image || "../assets/user.png"} alt="" />
      <div className="user-card-info">
        <span className="name">{props.user.displayName}</span>
        <div className="role">
          <FontAwesomeIcon icon={faBriefcase} />
          <span>{props.user.role}</span>
        </div>
      </div>
      <div className="user-card-actions">
        <Button
          color="blue"
          onClick={() =>
            openModals('userInfoModal', <UserInfoModal user={props.user} />, "small")
          }
          size="tiny"
          content="Информация"
        />
        <Button
          color="yellow"
          onClick={() =>
            openModals('userEditModal', <UserEditModal user={props.user} />, "small")
          }
          size="tiny"
          content="Редактирай"
        />
      </div>
    </div>
  );
});
