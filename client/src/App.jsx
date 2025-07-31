import { createContext, useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Homepage from "./apps/homepage";
import Article from "./apps/articleForm";

export const shopContext = createContext({
  user: "",
  addUser: () => {},
  token: "",
  addToken: () => {},
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
      { path: "/", element: <Homepage /> },
      { path: "/article", element: <Article /> },
    ],
  },
]);

function App() {
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const addUser = (userName) => {
    setUser(userName);
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
