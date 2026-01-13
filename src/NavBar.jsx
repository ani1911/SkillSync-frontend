import logo from "./assets/logo.png";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 ">
      <div className="flex-1">
        {/* ps-6 moves it to the right, w-40 makes it a medium-large size */}
        <img
          src={logo}
          alt="skillsync-logo"
          className="w-70 h-auto ps-6 cursor-pointer hover:scale-105 transition-transform duration-200"
        />
      </div>

      <div className="flex gap-2 mx-6 my-1">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
