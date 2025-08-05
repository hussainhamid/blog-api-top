import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../App";

export default function LogIn() {
  const [data, setData] = useState({
    userName: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [writer, setWriter] = useState(false);

  const { addToken, addUser, addWriter } = useContext(shopContext);

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
            addUser(res.data.user.username);
            navigate(`/${res.data.user.username}`);
          }

          if (res.data.user.status === "reader") {
            addWriter(false);
          } else if (res.data.user.status === "writer") {
            addWriter(true);
          }
        } catch (err) {
          console.log("error in if statement homepage.jsx", err);
        }
      }
    };

    fetchMe();
  }, [addUser, token, addWriter, navigate]);

  async function loginFunc(e) {
    e.preventDefault();

    if (!writer) {
      try {
        const res = await axios.post(
          "http://localhost:3000/log-in",
          {
            username: data.userName,
            password: data.password,
          },
          { withCredentials: true }
        );

        if (res.data.success) {
          localStorage.setItem("jwtToken", res.data.token);
          addToken(res.data.token);
          addUser(res.data.user.username);
          navigate(`/${res.data.user.username}`);
        } else {
          setMessage(res.data.message);
        }
      } catch (err) {
        console.log("error in homepage.jsx login", err);
      }
    } else {
      try {
        const res = await axios.put(
          "http://localhost:3000/log-in",
          {
            username: data.userName,
            password: data.password,
            writer,
          },
          { withCredentials: true }
        );

        if (res.data.success) {
          localStorage.setItem("jwtToken", res.data.token);
          addToken(res.data.token);
          addUser(res.data.user.username);
          navigate(`/${res.data.user.username}`);
        } else {
          setMessage(res.data.message);
        }
      } catch (err) {
        console.log("error in loginFunc put", err);
      }
    }
  }

  return (
    <>
      <div>
        <form>
          <div>
            <label htmlFor="username">username</label>
            <input
              type="text"
              className="username"
              value={data.userName}
              onChange={(e) => setData({ ...data, userName: e.target.value })}
            ></input>
          </div>

          <div>
            <label htmlFor="password">password</label>
            <input
              type="password"
              className="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            ></input>
          </div>

          <div>
            <label htmlFor="writer">Become a writer</label>
            <input
              type="checkbox"
              className="writer"
              checked={writer}
              onChange={(e) => setWriter(e.target.checked)}
            ></input>
          </div>

          <div>
            <button
              onClick={(e) => {
                loginFunc(e);
              }}
            >
              log in
            </button>
            <button onClick={() => navigate("/sign-up")}>Create account</button>
          </div>
        </form>
        <h2>{message}</h2>
      </div>
    </>
  );
}
