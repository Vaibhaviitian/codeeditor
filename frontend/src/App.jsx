import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CodeEditor from "./pages/editor/Editor";
import Home from "./pages/home/home";
import PhoneNumberPage from "./components/auth/Pn";
import OTPPage from "./components/auth/Otp";
import SignUpPage from "./components/auth/signup";
import SignInPage from "./components/auth/signin";
import Privateroutes from "./components/auth/Privateroute.jsx";
import CreateRoom from "./components/auth/socket.jsx";
import AboutPage from "./pages/about/about.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import ForgotPass from "./components/auth/Forgotpass.jsx";
import ResetPass from "./components/auth/Resetpass.jsx"
function App() {
  const [isLogin, setisLogin] = useState(localStorage.getItem("islogin"));

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about",
      element: <AboutPage />,
    },
    {
      path: "/editor",
      element: (
        <Privateroutes setisLogin={setisLogin}>
          <CodeEditor />
        </Privateroutes>
      ),
    },
    {
      path: "/Signin",
      element: <SignInPage setisLogin={setisLogin} />,
    },
    {
      path: "/Signup",
      element: <SignUpPage />,
    },
    {
      path: "/OTPverification",
      element: <OTPPage />,
    },
    {
      path: "/mobilenumberverication",
      element: <PhoneNumberPage />,
    },
    {
      path: "/ll",
      element: <CreateRoom />,
    },
    {
      path: "/user/profile",
      element: <UserProfile />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPass />,
    },
    {
      path:"/resetpassword/:token",
      element:<ResetPass/>
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
