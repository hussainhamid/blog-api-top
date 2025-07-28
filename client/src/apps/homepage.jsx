import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { shopContext } from "../App";

export default function Homepage() {
  const [data, setData] = useState({
    userName: "",
    password: "",
  });

  const [success, setSuccess] = useState(false);

  const { addToken, addUser, user } = useContext(shopContext);

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
            addUser(res.data.authData.user.username);
            setSuccess(true);
          }
        } catch (err) {
          console.log("error in if statement homepage.jsx", err);
        }
      }
    };

    fetchMe();
  }, [addUser, token]);

  async function login(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/log-in",
        {
          userName: data.userName,
          password: data.password,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.setItem("jwtToken", res.data.token);
        addToken(res.data.token);
        addUser(res.data.user.username);
        setSuccess(true);
      }
    } catch (err) {
      console.log("error in homepage.jsx login", err);
    }
  }

  const logOut = async (e) => {
    e.preventDefault();
    localStorage.removeItem("jwtToken");
    addToken("");
    addUser("");
  };

  return (
    <>
      <p>this is the homepage.</p>

      <p>Hello, {user || "guest"}</p>

      <div className="postDiv">
        <div className="post">
          <h3>post title</h3>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero,
            vitae aliquid cum, dolores deserunt est quasi hic earum eum fugit
            nulla aspernatur provident vero odit, inventore deleniti a illum!
            Cum.
          </p>
        </div>

        <div>
          {!success ? (
            <div>
              <div>
                <p>your token: {token}</p>
                <form>
                  <div>
                    <label htmlFor="username">username</label>
                    <input
                      type="text"
                      className="username"
                      value={data.userName}
                      onChange={(e) =>
                        setData({ ...data, userName: e.target.value })
                      }
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      className="password"
                      value={data.password}
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                    ></input>
                  </div>

                  <div>
                    <button
                      onClick={(e) => {
                        login(e);
                      }}
                    >
                      log in
                    </button>
                    <button>Create account</button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div>
              <h1>hello guest</h1>
              <form>
                <p>your token: Bearer {localStorage.getItem("jwtToken")}</p>
                <div>
                  <label htmlFor="comment"></label>
                  <input className="comment"></input>
                </div>
              </form>
              <button onClick={logOut}>logOut</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
