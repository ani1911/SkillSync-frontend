import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div className="bg-base-100 min-h-screen">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Body;
