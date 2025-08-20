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

  const [userComments, setUserComments] = useState([]);

  const [articlesValue, setArticlesValue] = useState("published");

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "info";
  });

  const [message, setMessage] = useState("");

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

    if (activeTab === "articles") {
      getArticlesInfo();
    } else if (activeTab === "comments") {
      getCommentsInfo();
    }

    fetchUserProfile();
  }, [navigate, token, user, activeTab]);

  const getArticlesInfo = async () => {
    localStorage.setItem("activeTab", "articles");

    try {
      const res = await axios.get(
        `http://localhost:3000/see-profile-article/${user}`,
        {
          withCredentials: true,
        }
      );

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

  const deleteArticle = async (e, articleSerialId) => {
    e.preventDefault();

    try {
      const res = await axios.delete(
        `http://localhost:3000/delete-article/${articleSerialId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setMessage(res.data.message);

        setPublishedArticles((prev) =>
          prev.filter((article) => article.articleSerialId !== articleSerialId)
        );

        setNotPublishedArticles((prev) =>
          prev.filter((article) => article.articleSerialId !== articleSerialId)
        );
      }
    } catch (err) {
      console.error("error in deleteArticle in profile.jsx", err);
    }
  };

  const publishArticle = async (e, articleSerialId) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3000/publish-article/${articleSerialId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setMessage(res.data.message);

        setNotPublishedArticles((prev) =>
          prev.filter((article) => article.articleSerialId !== articleSerialId)
        );
      }
    } catch (err) {
      console.error("error in publishArticle in Profile.jsx", err);
    }
  };

  const unPublishArticle = async (e, articleSerialId) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3000/unPublish-article/${articleSerialId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage(res.data.message);

        setPublishedArticles((prev) =>
          prev.filter((article) => article.articleSerialId !== articleSerialId)
        );
      }
    } catch (err) {
      console.error("error in unPublishArticle in profile.jsx", err);
    }
  };

  const getCommentsInfo = async () => {
    localStorage.setItem("activeTab", "comments");

    try {
      const res = await axios.get(
        `http://localhost:3000/see-profile-comments/${user}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setUserComments(res.data.allComments);
      }
    } catch (err) {
      console.error("error in getCommentsInfo in Profile.jsx", err);
    }
  };

  const deleteComment = async (e, commentSerialId) => {
    e.preventDefault();

    try {
      const res = await axios.delete(
        `http://localhost:3000/delete-comment/${commentSerialId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage(res.data.message);
        setUserComments((prev) =>
          prev.filter((comment) => comment.commentSerialId !== commentSerialId)
        );
      }
    } catch (err) {
      console.error("error in deleteComment in profile.jsx", err);
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
        <button
          onClick={() => {
            setActiveTab("comments");
            localStorage.setItem("activeTab", "comments");
          }}
        >
          comments
        </button>
        <button onClick={() => navigate("/")}>homepage</button>
      </nav>

      {activeTab === "info" && (
        <div>
          <p>username: {userInformation?.username}</p>
          {userInformation.email && <p>email: {userInformation.email}</p>}
          <p>status: {userInformation.status}</p>
          <p>total articles: {userInformation.articlesNumber}</p>
          <p>comments: {userInformation.commentsNumber}</p>
        </div>
      )}

      {activeTab === "articles" && (
        <div className="articles-div">
          <h3>{message}</h3>

          <div className="dropdown">
            <label htmlFor="articles-dropdown">you are seeing:</label>
            <select
              className="articles-dropdown"
              value={articlesValue}
              onChange={(e) => setArticlesValue(e.target.value)}
            >
              <option value="published">published</option>
              <option value="not-published">not published</option>
            </select>
          </div>
          {articlesValue === "published" && (
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
                  <button
                    onClick={(e) =>
                      unPublishArticle(e, article.articleSerialId)
                    }
                  >
                    unpublish
                  </button>
                  <button
                    onClick={(e) => deleteArticle(e, article.articleSerialId)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {articlesValue === "not-published" && (
            <div className="not-published-div">
              <h2>un published articles</h2>

              {notPublishedArticles.map((article, index) => (
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

                  <button
                    onClick={(e) => publishArticle(e, article.articleSerialId)}
                  >
                    publish
                  </button>
                  <button
                    onClick={(e) => deleteArticle(e, article.articleSerialId)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "comments" && (
        <div className="comments-div">
          <h3>comments</h3>

          {userComments.map((comment) => (
            <div key={comment.id}>
              <h4>{comment.user.username}: </h4>
              <h4>{comment.comment}</h4>
              <h4>{comment.commentSerialId}</h4>

              <button
                onClick={(e) => deleteComment(e, comment.commentSerialId)}
              >
                Delete
              </button>
              <button>See article</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
