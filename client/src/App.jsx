import { createContext, useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import LogIn from "./apps/login";
import Signup from "./apps/signup";
import Homepage from "./apps/homepage";
import CreateArticle from "./apps/articleForm";
import SeeArticle from "./apps/seeArticles";
import Profile from "./apps/profile";

export const shopContext = createContext({
  user: "",
  addUser: () => {},
  token: "",
  addToken: () => {},
  addWriter: () => {},
});

function Layout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <LogIn /> },
      { path: "/sign-up", element: <Signup /> },
      { path: "/log-in", element: <LogIn /> },
      { path: "/:username", element: <Homepage /> },
      { path: "/article", element: <CreateArticle /> },
      { path: "/see-article/:articleSerialId", element: <SeeArticle /> },
      { path: "/profile/:user", element: <Profile /> },
    ],
  },
]);

function App() {
  const [user, setUser] = useState("");
  const [token, setToken] = useState(
    () => localStorage.getItem("jwtToken") || ""
  );
  const [writer, setWriter] = useState(false);
  const addUser = (userName) => {
    setUser(userName);
  };

  const addToken = (bearerToken) => {
    setToken(bearerToken);
  };

  const addWriter = (writer) => {
    setWriter(writer);
  };

  return (
    <shopContext.Provider
      value={{ user, token, addToken, addUser, addWriter, writer }}
    >
      <RouterProvider router={router} />
    </shopContext.Provider>
  );
}

export default App;
