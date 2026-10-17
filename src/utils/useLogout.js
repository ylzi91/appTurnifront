import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RemoveUserAction, removeRoleAction, removeTokenAction } from "../redux/actions";

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return () => {
    dispatch(removeTokenAction());
    dispatch(removeRoleAction());
    dispatch(RemoveUserAction());
    navigate("/");
  };
}
