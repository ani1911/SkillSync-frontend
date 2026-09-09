import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import api from "./utils/axios";
import { addUser, removeUser } from "./store/userSlice";

const Body = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();

  // Restore the session on page load: the JWT lives in an HTTP-only cookie,
  // so we ask the backend who we are and hydrate the redux store.
  useEffect(() => {
    const fetchLoggedInUser=async ()=>{
      try {
        const res=await api.get("/profile/view");
        dispatch(addUser(res.data));
      } catch (err) {
        // Not authenticated -> redirect to login
        if (err.response?.status === 400 || err.response?.status === 401) {
          dispatch(removeUser());
          navigate("/login");
        }
        console.error(err);
      }
    };
    fetchLoggedInUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-base-100 min-h-screen">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Body;

