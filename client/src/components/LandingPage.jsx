import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Navbar from "./Navbar";
import { useAuth } from "./auth";

function LandingPage() {
  /** Make it global for all the application **/
  const auth = useAuth();
  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    const userObject = jwt_decode(response.credential);
    logUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    document.getElementById("signInOr").hidden = true;
    document.getElementById("signInButton").hidden = true;
    navigate("/home", { replace: true });
  }

  function handleSignOut(e) {
    auth.logout();
    document.getElementById("signInDiv").hidden = false;
    document.getElementById("signInOr").hidden = false;
    document.getElementById("signInButton").hidden = false;
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
    google.accounts.id.initialize({
      client_id:
        "984856038861-je945u8bmej6d99601n4rs2v5v7isetl.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    google.accounts.id.prompt();
  }, []);

  return (
    <div className="bg-japanese-house bg-fixed bg-clip-border bg-origin-border bg-cover bg-top bg-no-repeat h-screen w-screen">
      <Navbar />
      <div className="flex flex-row w-full">
        <div className="flex flex-col text-left mt-10 ml-20 w-[40vw]">
          <h3 className="text-6xl font-bold text-white mt-3">Yumm</h3>
          <h3 className="text-6xl font-bold text-amber-900 mt-2">
            Designs to <br></br>Die for.
          </h3>
          <p className="mt-5 font-montserrat">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel optio
            mollitia repellendus eligendi. Vel optio mollitia repellendus
            eligendi.
          </p>

          {auth.user ? (
            <div className="flex flex-row gap-3 text-lg">
              <div>Welcome {auth.user.name}!</div>
              <button className="font-bold">Go to the page</button>
              <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-3 mt-7">
              <div className="" id="signInDiv"></div>
              <p className="" id="signInOr">
                or
              </p>
              <a href="/home" className="text-m font-bold" id="signInButton">
                Continue as a guest
              </a>
            </div>
          )}
        </div>
        <div className="w-[60vw]"></div>
      </div>
    </div>
  );
}

export default LandingPage;
