import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SeeArticle() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const token = localStorage.getItem("jwtToken");

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
          }
        } catch (err) {
          console.log("error in if statement homepage.jsx", err);
        }
      } else {
        navigate("/log-in");
      }
    };

    fetchMe();
  });

  return <p>hello {user}</p>;
}
