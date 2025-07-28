import { createContext, useEffect, useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import axios from "axios";

import Homepage from "./apps/homepage";

export const shopContext = createContext({
  user: "",
  addUser: () => {},
  token: "",
  addToken: () => {},
  fetchUser: () => {},
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
    children: [{ path: "/", element: <Homepage /> }],
  },
]);

function App() {
  const [user, setuser] = useState("");
  const [token, setToken] = useState("");
  const addUser = (userName) => {
    setuser(userName);
  };

  const addToken = (bearerToken) => {
    setToken(bearerToken);
  };

  return (
    <shopContext.Provider value={{ user, token, addToken, addUser }}>
      <RouterProvider router={router} />
    </shopContext.Provider>
  );
}

export default App;
