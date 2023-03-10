import logo from "../assets/HOUSINGLOGOcut.png";
import { Link } from "react-router-dom";
import { useAuth } from "./auth";
import Hamburger from "./Hamburger";

export default function Navbar() {
  const auth = useAuth();
  const userId = auth.user?._id;

  function handleSignOut(e) {
    auth.logout();
  }

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between sm:px-8 px-4 py-4">
      <div className="lg:hidden w-full flex flex-row-reverse">
        <Hamburger />
      </div>
      <div className="flex flex-row items-center gap-3 p-3">
        <div className="flex flex-row items-center gap-3 p-3">
          <img src={logo} width={50} height={50}></img>
          <h1 className="text-2xl lg:text-xl text-montserrat font-bold uppercase">
            Nội thất nhà đẹp
          </h1>
        </div>
        <div className="hidden lg:block">
          <div className="flex ml-5 gap-5 font-bold text-lg">
            <Link to="/">
              {auth.user ? (
                <div onClick={(e) => handleSignOut(e)}>Logout</div>
              ) : (
                "Login"
              )}
            </Link>
            <Link to="/home">Home</Link>
            {auth.user && <Link to={`/profile/${userId}`}>Profile</Link>}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-3">
        {auth.user && (
          <Link
            to={`/create-post/${userId}`}
            className="font-medium bg-blue-600 text-white px-4 py-2 rounded-md text-center w-screen lg:w-auto"
          >
            Create post
          </Link>
        )}
      </div>
    </div>
  );
}
