import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import api from "../utils/axios";
import { addUser, removeUser } from "../store/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await api.get("/profile/view");
        dispatch(addUser(res.data));
      } catch (err) {
        if (err.response?.status === 400 || err.response?.status === 401) {
          dispatch(removeUser());
          const publicPaths = ["/", "/signup", "/login"];
          if (!publicPaths.includes(window.location.pathname)) {
             navigate("/login");
          }
        }
        console.error(err);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchLoggedInUser();
  }, []);

  return (
    <div className="min-h-screen bg-base-300 relative overflow-hidden flex flex-col font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 z-0"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-accent/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-4000 z-0"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {authLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <span className="loading loading-spinner text-primary loading-lg"></span>
          </div>
        ) : (
          <>
            <NavBar />
            <main className="flex-grow flex flex-col">
              <Outlet />
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default Body;
