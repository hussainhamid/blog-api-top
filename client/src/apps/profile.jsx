import axios from "axios";
import { act, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const [user, setUser] = useState("");

  const [publishedArticles, setPublishedArticles] = useState([]);
  const [notPublishedArticles, setNotPublishedArticles] = useState([]);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "info";
  });

  const [userInformation, setUserInfo] = useState({
    username: "",
    email: "",
    status: "",
    commentsNumber: 0,
    articlesNumber: 0,
  });

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

    const fetchUserProfile = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/profile",
          { username: user },
          { withCredentials: true }
        );

        if (res.data.success && res.data.userInfo) {
          setUserInfo({
            username: res.data.userInfo.username,
            email: res.data.userInfo.email,
            status: res.data.userInfo.status,
            commentsNumber: res.data.userInfo._count.Comments,
            articlesNumber: res.data.userInfo._count.articles,
          });
        }
      } catch (err) {
        console.error("error in fetchUserProfile in profile.jsx", err);
      }
    };

    fetchMe();
    fetchUserProfile();
  }, [navigate, token, user]);

  const getArticlesInfo = async (e) => {
    e.preventDefault();
    setActiveTab("articles");
    localStorage.setItem("activeTab", "articles");
  };

  return (
    <>
      <nav>
        <button
          onClick={() => {
            setActiveTab("info");
            localStorage.setItem("activeTab", "info");
          }}
        >
          info
        </button>
        <button onClick={(e) => getArticlesInfo(e)}>articles</button>
        <button onClick={() => setActiveTab("comments")}>comments</button>
      </nav>

      {activeTab === "info" && (
        <div>
          <p>username: {userInformation?.username}</p>
          {userInformation.email && <p>email: {userInformation.email}</p>}
          <p>status: {userInformation.status}</p>
          <p>articles: {userInformation.articlesNumber}</p>
          <p>comments: {userInformation.commentsNumber}</p>
        </div>
      )}

      {activeTab === "articles" && (
        <div className="articles-div">
          <h1>article Section</h1>
        </div>
      )}
    </>
  );
}
