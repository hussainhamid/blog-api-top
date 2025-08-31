import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import styled from "styled-components";

const CommentDiv = styled.div`
  border: 1px solid grey;
  border-radius: 1rem;
  padding: 0.2rem;
  padding-top: 1rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 10%;

  @media (max-width: 780px) {
    width: 100%;
    padding: 0.5rem;
  }
`;

export default function SeeArticle() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [articleContent, setArticleContent] = useState({
    title: "",
    content: "",
    username: "",
  });
  const [comments, setComments] = useState([]);

  const [comment, setComment] = useState("");

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("jwtToken");

  const { articleSerialId } = useParams();

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
            setUserId(res.data.user.id);
          }
        } catch (err) {
          console.log("error in if statement homepage.jsx", err);
        }
      } else {
        navigate("/log-in");
      }
    };

    const fetchArticle = async () => {
      try {
        const res = await axios.post(
          `/see-article/${articleSerialId}`,
          { articleSerialId },
          { withCredentials: true }
        );

        if (res.data.success) {
          const article = res.data.article;

          const sanitizedArticles = DOMPurify.sanitize(article.content);

          setArticleContent({
            title: article.title,
            content: sanitizedArticles,
            username: article.user.username,
          });

          setComments(article.comments);
        }
      } catch (err) {
        console.error("error in fetchArticle in seeArticles.jsx", err);
      }
    };

    fetchMe();
    fetchArticle();
  });

  const addComment = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/create-comment",
        {
          articleSerialId,
          userId,
          comment,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage(res.data.message);
      } else {
        setMessage("comment not created check console for more info");
      }
    } catch (err) {
      console.error("error in addComment func in seeArticle.jsx", err);
    }
  };

  return (
    <>
      <button onClick={() => navigate("/")}>Homepage</button>

      <div>
        <h2>{articleContent.title}</h2>
        <p>created by: {articleContent.username}</p>
        <div dangerouslySetInnerHTML={{ __html: articleContent.content }} />

        <div>
          <label htmlFor="comment">Add comment:</label>
          <textarea
            type="text"
            id="comment"
            className="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={50}
          ></textarea>
          <button onClick={(e) => addComment(e)}>Add Comment</button>
          <p>{message}</p>
        </div>

        <h3>Comments:</h3>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c, index) => (
          <CommentDiv key={index} style={{ marginBottom: "1rem" }}>
            <strong>{c.user.username}:</strong>
            <p>{c.comment}</p>
          </CommentDiv>
        ))}
      </div>
    </>
  );
}
