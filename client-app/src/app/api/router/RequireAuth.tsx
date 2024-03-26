import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useStore } from "../../stores/store";
interface Props {
    roles?: string[];
}

export default function RequireAuth({ roles }: Props) {
    const { userStore: { isLoggedIn, user } } = useStore();
    const location = useLocation();

    if (!isLoggedIn && !user) {
        return <Navigate to='/' state={{ from: location }} />
    }

    if (roles && !roles.some(r => user?.role.includes(r))) {
        toast.error('Нямате достъп до тази страница!');
        return <Navigate to='/orders' state={{ from: location }} />
    }
    return <Outlet />
}
