import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RemoveUserAction, removeRoleAction, removeTokenAction } from "../redux/actions";

export default function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useCallback(() => {
    dispatch(removeTokenAction());
    dispatch(removeRoleAction());
    dispatch(RemoveUserAction());
    navigate("/");
  }, [dispatch, navigate]);
}
