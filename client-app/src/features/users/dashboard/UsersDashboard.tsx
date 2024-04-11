import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../../app/stores/store";

import LoadingComponent from "../../../app/layout/LoadingComponent";
import UserActions from "./UserActions";
import UserCard from "./UserCard";

export default observer(function UsersDashboard() {
  const { userStore } = useStore();
  const { getUsers, userRegistry, loadUsers, loadingUsers } = userStore;

  useEffect(() => {
    if (userRegistry.size < 1) loadUsers();
  }, [loadUsers, userRegistry.size]);

  if (loadingUsers)
    return <LoadingComponent content="Зареждане на служители..." />;

  return (
    <>
      <UserActions />
      <div className="users-wrapper">
        {getUsers.map((user, index) => (
          <UserCard key={index} user={user} />
        ))}
      </div>
    </>
  );
});
