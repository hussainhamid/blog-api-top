import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import styled from "styled-components";

export default function Profile() {
  const BodyDiv = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const Nav = styled.nav`
    display: flex;
    margin: auto;
    gap: 20px;
  `;

  const ArticleContainer = styled.div`
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    flex-wrap: wrap;
  `;

  const ArticleDiv = styled.div`
    width: auto;
    height: auto;
    border: 1px solid grey;
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 1rem;

    @media (max-width: 780px) {
      width: 400px;
    }
  `;

  const CommentsContainer = styled.div`
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    flex-wrap: wrap;
  `;

  const CommentDiv = styled.div`
    width: 400px;
    height: auto;
    border: 1px solid grey;
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 1rem;
    display: flex;
    flex-direction: column;

    overflow-wrap: break-word;
    white-space: normal;
  `;

  const InfoDiv = styled.div`
    margin-top: 40px;
    width: 60%;
    margin: auto;
    margin-top: 40px;
  `;

  const Fieldset = styled.fieldset`
    border: 1px solid grey;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    border-radius: 1rem;

    legend {
      padding: 0 0.5rem;
      font-weight: bold;
    }
  `;

  const LoadingDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    backdrop-filter: blur(10px);
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const LoadingInsideDiv = styled.div`
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

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
    publishedArticlesNumber: 0,
    notPublishedArticlesNumber: 0,
  });

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await axios.get(
            "/me",
            {
              headers: {
                Authorization: `bearer ${token}`,
              },
            },
            { withCredentials: true }
          );

          if (res.data.success) {
            setUser(res.data.user.username);
            setLoading(false);
          }
        } catch (err) {
          console.log("error in if statement homepage.jsx", err);
        }
      } else {
        navigate("/log-in");
      }
    };

    fetchMe();
  }, [navigate, token]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      if (activeTab === "articles") {
        await getArticlesInfo();
      } else if (activeTab === "comments") {
        await getCommentsInfo();
      } else if (activeTab === "info") {
        await fetchUserProfile();
      }
    };

    fetchData();
  }, [user, activeTab]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/profile",
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
          publishedArticlesNumber: res.data.userInfo.publishedArticlesNumber,
          notPublishedArticlesNumber:
            res.data.userInfo.notPublishedArticlesNumber,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error("error in fetchUserProfile in profile.jsx", err);
    }
  };

  const getArticlesInfo = async () => {
    localStorage.setItem("activeTab", "articles");

    try {
      setLoading(true);
      const res = await axios.get(`/see-profile-article/${user}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const unPublishedSanitizedArticles = res.data.unpublishedArticles.map(
          (article) => {
            const content = DOMPurify.sanitize(article.content);
            const title = article.title;

            return {
              ...article,
              content,
              preview:
                content.length > 100 ? content.slice(0, 50) + "..." : content,
              previewTitle:
                title.length > 30 ? title.slice(0, 10) + "..." : title,
            };
          }
        );

        const publishedSanitizedArticles = res.data.publishedArticles.map(
          (article) => {
            const content = DOMPurify.sanitize(article.content);
            const title = article.title;

            return {
              ...article,
              content,
              preview:
                content.length > 100 ? content.slice(0, 50) + "..." : content,
              previewTitle:
                title.length > 30 ? title.slice(0, 10) + "..." : title,
            };
          }
        );

        setPublishedArticles(publishedSanitizedArticles);
        setNotPublishedArticles(unPublishedSanitizedArticles);

        setLoading(false);
      }
    } catch (err) {
      console.error("error in getArticleInfo in profile.jsx", err);
    }
  };

  const deleteArticle = async (e, articleSerialId) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.delete(`/delete-article/${articleSerialId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setMessage(res.data.message);

        setPublishedArticles((prev) =>
          prev.filter((article) => article.articleSerialId !== articleSerialId)
        );

        setNotPublishedArticles((prev) =>
          prev.filter((article) => article.articleSerialId !== articleSerialId)
        );

        setLoading(false);
      }
    } catch (err) {
      console.error("error in deleteArticle in profile.jsx", err);
    }
  };

  const publishArticle = async (e, articleSerialId) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.put(`/publish-article/${articleSerialId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setMessage(res.data.message);

        setNotPublishedArticles((prev) =>
          prev.filter((article) => article.articleSerialId !== articleSerialId)
        );

        setLoading(false);
      }
    } catch (err) {
      console.error("error in publishArticle in Profile.jsx", err);
    }
  };

  const unPublishArticle = async (e, articleSerialId) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.put(`/unPublish-article/${articleSerialId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setMessage(res.data.message);

        setPublishedArticles((prev) =>
          prev.filter((article) => article.articleSerialId !== articleSerialId)
        );
        setLoading(false);
      }
    } catch (err) {
      console.error("error in unPublishArticle in profile.jsx", err);
    }
  };

  const getCommentsInfo = async () => {
    localStorage.setItem("activeTab", "comments");

    try {
      setLoading(true);
      const res = await axios.get(`/see-profile-comments/${user}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const comments = res.data.allComments.map((comment) => {
          const content = comment.comment;
          const username = comment.user.username;

          return {
            content,
            username,
            previewComment:
              content.length > 20 ? content.slice(0, 50) + "...." : content,
          };
        });

        setUserComments(comments);
        setLoading(false);
      }
    } catch (err) {
      console.error("error in getCommentsInfo in Profile.jsx", err);
    }
  };

  const deleteComment = async (e, commentSerialId) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.delete(`/delete-comment/${commentSerialId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setMessage(res.data.message);
        setUserComments((prev) =>
          prev.filter((comment) => comment.commentSerialId !== commentSerialId)
        );

        setLoading(false);
      }
    } catch (err) {
      console.error("error in deleteComment in profile.jsx", err);
    }
  };

  return (
    <>
      <BodyDiv>
        <Nav>
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
          <button onClick={() => navigate(`/${userInformation.username}`)}>
            homepage
          </button>
        </Nav>

        {activeTab === "info" && (
          <InfoDiv>
            <Fieldset>
              <legend>Name</legend>
              <p>{userInformation?.username}</p>
            </Fieldset>
            {userInformation.email && (
              <Fieldset>
                <legend>Email</legend>
                <p>{userInformation.email}</p>
              </Fieldset>
            )}
            <Fieldset>
              <legend>Status</legend>
              <p>{userInformation.status}</p>
            </Fieldset>
            <Fieldset>
              <legend>Total articles</legend>
              <p>{userInformation.articlesNumber}</p>
            </Fieldset>
            <Fieldset>
              <legend>Published articles</legend>
              <p>{userInformation.publishedArticlesNumber}</p>
            </Fieldset>
            <Fieldset>
              <legend>Un-published articles</legend>
              <p>{userInformation.notPublishedArticlesNumber}</p>
            </Fieldset>
            <Fieldset>
              <legend>Total comments</legend>
              <p>{userInformation.commentsNumber}</p>
            </Fieldset>
          </InfoDiv>
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

                <ArticleContainer>
                  {publishedArticles.map((article, index) => (
                    <ArticleDiv key={index}>
                      <p>user: {article.user.username}</p>
                      <p>title: {article.previewTitle}</p>
                      <div
                        dangerouslySetInnerHTML={{ __html: article.preview }}
                      />
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
                        onClick={(e) =>
                          deleteArticle(e, article.articleSerialId)
                        }
                      >
                        Delete
                      </button>
                    </ArticleDiv>
                  ))}
                </ArticleContainer>
              </div>
            )}

            {articlesValue === "not-published" && (
              <div className="not-published-div">
                <h2>un published articles</h2>

                <ArticleContainer>
                  {notPublishedArticles.map((article, index) => (
                    <ArticleDiv key={index}>
                      <p>user: {article.user.username}</p>
                      <p>title: {article.previewTitle}</p>
                      <div
                        dangerouslySetInnerHTML={{ __html: article.preview }}
                      />
                      <button
                        onClick={() =>
                          navigate(`/see-article/${article.articleSerialId}`)
                        }
                      >
                        see Article
                      </button>

                      <button
                        onClick={(e) =>
                          publishArticle(e, article.articleSerialId)
                        }
                      >
                        publish
                      </button>
                      <button
                        onClick={(e) =>
                          deleteArticle(e, article.articleSerialId)
                        }
                      >
                        Delete
                      </button>
                    </ArticleDiv>
                  ))}
                </ArticleContainer>
              </div>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="comments-div">
            <h3>comments</h3>

            <CommentsContainer>
              {userComments.map((comment) => (
                <CommentDiv key={comment.id}>
                  <div>
                    <h4>{comment.username}: </h4>
                  </div>
                  <div>
                    <h5>{comment.previewComment}</h5>
                  </div>
                  <div>
                    <button
                      onClick={(e) => deleteComment(e, comment.commentSerialId)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/see-article/${comment.articleId}`)
                      }
                    >
                      See article
                    </button>
                  </div>
                </CommentDiv>
              ))}
            </CommentsContainer>
          </div>
        )}
      </BodyDiv>

      {loading && (
        <LoadingDiv>
          <LoadingInsideDiv>
            <p>loading...</p>
          </LoadingInsideDiv>
        </LoadingDiv>
      )}
    </>
  );
}
