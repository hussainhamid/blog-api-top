import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { shopContext } from "../App";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import styled from "styled-components";

export default function Homepage() {
  const BodyDiv = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const ArticleContainer = styled.div`
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    flex-wrap: wrap;
  `;

  const ArticleDiv = styled.div`
    width: 500px;
    height: auto;
    border: 1px solid grey;
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 1rem;
  `;

  const [writer, setWriter] = useState(false);
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);

  const { addToken, addUser, token, user } = useContext(shopContext);

  const navigate = useNavigate();

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
      }
    };

    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:3000/get-articles", {
          withCredentials: true,
        });

        if (res.data.success) {
          const sanitizedArticles = res.data.allArticles.map((article) => {
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
          });

          setArticles(sanitizedArticles);
        }
      } catch (err) {
        console.error("error in fetchAticles in homepage.jsx", err);
      }
    };

    fetchMe();
    fetchArticles();
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
      <BodyDiv>
        <div>
          <nav>
            {writer && (
              <button onClick={() => navigate("/article")}>
                Create article
              </button>
            )}

            <button onClick={() => navigate(`/profile/${user}`)}>
              Profile
            </button>
            <button onClick={() => logOut()}>logOut</button>

            {!writer && (
              <button onClick={() => becomeWriter()}>Become Writer</button>
            )}
          </nav>
        </div>

        <p>{message}</p>

        <ArticleContainer>
          {articles.map((article, index) => (
            <ArticleDiv key={index}>
              <p>user: {article.user.username}</p>
              <p>title: {article.previewTitle}</p>
              <div dangerouslySetInnerHTML={{ __html: article.preview }} />
              <button
                onClick={() =>
                  navigate(`/see-article/${article.articleSerialId}`)
                }
              >
                see Article
              </button>
            </ArticleDiv>
          ))}
        </ArticleContainer>
      </BodyDiv>
    </>
  );
}
