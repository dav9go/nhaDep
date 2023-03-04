import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./auth";

export default function Hamburger() {
  const [opened, setOpened] = useState(false);

  //To redirect
  const location = useLocation();

  //Authorization info
  const auth = useAuth();

  const userId = auth.user?._id;

  function handleSignOut(e) {
    auth.logout();
  }

  return (
    <button
      className={`button-one ${
        opened && "fixed z-50 top-0 left-0 h-full w-full bg-white"
      }`}
      aria-controls="primary-navigation"
      aria-expanded={opened ? "true" : "false"}
      onClick={() => setOpened(!opened)}
    >
      <svg
        className={`hamburger  ${opened && " fixed top-4 right-4"} `}
        viewBox="0 0 100 100"
        width="60"
      >
        <rect
          className="line line-top"
          width="80"
          height="10"
          x="10"
          y="25"
          rx="5"
        ></rect>
        <rect
          className="line line-middle"
          width="80"
          height="10"
          x="10"
          y="45"
          rx="5"
        ></rect>
        <rect
          className="line line-bottom"
          width="80"
          height="10"
          x="10"
          y="65"
          rx="5"
        ></rect>
      </svg>
      {opened && (
        <div>
          <ul className="flex flex-col gap-10 text-5xl">
            <Link
              className={` cursor-pointer link relative ${
                location.pathname == "/"
                  ? "underline underline-offset-8"
                  : "link"
              }`}
              to="/"
            >
              {auth.user ? (
                <div onClick={(e) => handleSignOut(e)}>Logout</div>
              ) : (
                "Login"
              )}
            </Link>
            <Link
              to="/home"
              className={` cursor-pointer link relative ${
                location.pathname == "/home"
                  ? "underline underline-offset-8"
                  : "link"
              }`}
            >
              Home
            </Link>
            {auth.user && (
              <Link
                className={` cursor-pointer link relative ${
                  location.pathname == "/profile"
                    ? "underline underline-offset-8"
                    : "link"
                }`}
                to={`/profile/${userId}`}
              >
                Profile
              </Link>
            )}
          </ul>
        </div>
      )}
    </button>
  );
}
