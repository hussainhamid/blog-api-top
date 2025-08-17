import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

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

    if (activeTab === "articles") {
      getArticlesInfo();
    }

    fetchMe();
    fetchUserProfile();
  }, [navigate, token, user, activeTab]);

  const getArticlesInfo = async () => {
    localStorage.setItem("activeTab", "articles");

    try {
      const res = await axios.get("http://localhost:3000/see-profile-article", {
        withCredentials: true,
      });

      if (res.data.success) {
        const publishedSanitizedArticles = res.data.publishedArticles.map(
          (article) => ({
            ...article,
            content: DOMPurify.sanitize(article.content),
          })
        );

        const unPublishedSanitizedArticles = res.data.unpublishedArticles.map(
          (article) => ({
            ...article,
            content: DOMPurify.sanitize(article.content),
          })
        );

        setPublishedArticles(publishedSanitizedArticles);
        setNotPublishedArticles(unPublishedSanitizedArticles);
      }
    } catch (err) {
      console.error("error in getArticleInfo in profile.jsx", err);
    }
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
        <button
          onClick={() => {
            setActiveTab("articles");
            localStorage.setItem("activeTab", "articles");
          }}
        >
          articles
        </button>
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
          <div className="published-div">
            <h2>published articles</h2>

            {publishedArticles.map((article, index) => (
              <div key={index}>
                <p>user: {article.user.username}</p>
                <p>title: {article.title}</p>
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                <button
                  onClick={() =>
                    navigate(`/see-article/${article.articleSerialId}`)
                  }
                >
                  see Article
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
