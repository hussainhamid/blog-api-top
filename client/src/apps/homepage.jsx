import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { shopContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const [user, setUser] = useState("");
  const [writer, setWriter] = useState(false);
  const [message, setMessage] = useState("");

  const { addToken, addUser } = useContext(shopContext);

  const navigate = useNavigate();

  let token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await axios.get(
            "http://localhost:3000/me",
            {
              headers: {
                Authorization: `bearer ${token}`,
              },
            },
            { withCredentials: true }
          );

          if (res.data.success) {
            setUser(res.data.user.username);
            addUser(res.data.user.username);
          } else {
            navigate("/log-in");
          }

          if (res.data.user.status === "reader") {
            setWriter(false);
          } else if (res.data.user.status === "writer") {
            setWriter(true);
          }
        } catch (err) {
          console.log("error in if statement homepage.jsx", err);
        }
      } else {
        navigate("/log-in");
      }
    };

    fetchMe();
  }, [addUser, token, navigate]);

  const logOut = async () => {
    try {
      const res = await axios.get("http://localhost:3000/log-out", {
        withCredentials: true,
      });

      if (res.data.loggedOut) {
        localStorage.removeItem("jwtToken");
        addToken("");
        addUser("");
        setUser("");
        navigate("/");
      }
    } catch (err) {
      console.log("error in logout function in homepage.jsx", err);
    }
  };

  const becomeWriter = async () => {
    try {
      const res = await axios.put(
        "http://localhost:3000/become-writer",
        { username: user },
        { withCredentials: true }
      );

      if (res.data.success) {
        setWriter(true);
        setMessage(res.data.message);
        navigate("/");
      }
    } catch (err) {
      console.log("error in becomeWriter in homepage", err);
    }
  };

  return (
    <>
      <p>this is the homepage.</p>
      <p>{message}</p>
      <p>click below to create or see articles.</p>

      <h2>Hello, {user || "guest"}</h2>

      <div>
        <button onClick={logOut}>logOut</button>

        {writer && (
          <button onClick={() => navigate("/article")}>Create article</button>
        )}

        <button>See Articles</button>

        {!writer && (
          <button onClick={() => becomeWriter()}>Become Writer</button>
        )}
      </div>
    </>
  );
}
