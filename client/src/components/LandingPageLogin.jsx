import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useAuth } from "./auth";
import logo from "../assets/HOUSINGLOGOcut.png";

export default function LandingPageLogin() {
  /** Make it global for all the application **/
  const auth = useAuth();
  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    const userObject = jwt_decode(response.credential);
    logUser(userObject);
    navigate("/home", { replace: true });
  }

  async function logUser(userObject) {
    console.log(userObject);
    await fetch("https://nhadep.onrender.com/api/v1/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObject),
    }).then((res) => res.json().then((data) => auth.login(data.data[0])));
  }

  useEffect(() => {
    /** Global Google **/
    window.google.accounts.id.initialize({
      client_id:
        "984856038861-je945u8bmej6d99601n4rs2v5v7isetl.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {
        theme: "outline",
        size: "large",
      }
    );

    google.accounts.id.prompt();
  }, []);

  return (
    <main className="container relative flex overflow-hidden lg:mx-auto lg:grid lg:grid-cols-8 h-screen w-screen bg-white">
      <div className="col-span-2">
        <div className="hidden relative lg:flex lg:justify-between">
          <span className="animatedballs8 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs14 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs9 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs10 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs15 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs11 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs12 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs7 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs13 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
        </div>
      </div>
      <div className="col-span-4 w-full lg:w-auto xl:mx-20 flex flex-col justify-center items-center max-h-screen bg-[url('./assets/loadingpic.png')] bg-no-repeat bg-cover">
        <div className="flex flex-col justify-center py-6 px-3 rounded-xl items-center gap-3 bg-white/90">
          <div className="flex flex-row items-center justify-center gap-3 p-3">
            <img src={logo} width={50} height={50}></img>
            <h1 className="text-2xl lg:text-xl text-montserrat font-bold uppercase">
              Nội thất nhà đẹp
            </h1>
          </div>
          <p className="mb-20">Interior Design Platform</p>
          <div className="" id="signInDiv"></div>
          <p className="" id="signInOr">
            or
          </p>
          <a href="/home" className="text-m font-bold" id="signInButton">
            Continue as a guest
          </a>
        </div>
      </div>
      <div className="col-span-2">
        <div className="hidden relative lg:flex lg:justify-between">
          <span className="animatedballs8 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs14 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs9 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs10 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs15 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs11 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs12 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs7 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
          <span className="animatedballs13 relative w-3 h-3 bg-red-600 my-1 rounded-full shadow-lg"></span>
        </div>
      </div>
    </main>
  );
}
