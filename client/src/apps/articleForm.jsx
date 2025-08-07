import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TitleDiv = styled.div`
  display: flex;
  text-align: left;
  gap: 10px;
  font-size: 1.3rem;
  border: 1px solid white;
  border-radius: 10px;
  padding: 0.7rem;
  background-color: rgba(255, 255, 255, 0.87);
  color: #242424;
`;

const Title = styled.input`
  font-size: 1.1rem;
  font-weight: bold;
  background: transparent;
  border: none;
  border-bottom: 1px solid #242424;
  color: #242424;
  padding-left 10px;
  width: 100%;
`;

const BtnDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  font-size: 1.1rem;
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

export default function CreateArticle() {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setuser] = useState("");
  const [message, setMessage] = useState("");

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
            setuser(res.data.user.username);
          }

          if (res.data.user.status === "reader") {
            navigate("/");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = editorRef.current.getContent();

    try {
      const res = await axios.post("http://localhost:3000/article", {
        title: title,
        content: content,
        username: user,
      });

      if (res.data.success) {
        console.log("recieved and stored the data");
        setMessage(res.data.message);
      }
    } catch (err) {
      console.log("error in handleSubmit", err);
    }
  };

  return (
    <>
      <div>
        <Form>
          <TitleDiv>
            <label htmlFor="title">Title:</label>
            <Title
              className="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Title>
          </TitleDiv>

          <Editor
            apiKey={import.meta.env.VITE_TINYMCEAPIKEY}
            onInit={(evt, editor) => {
              editorRef.current = editor;
              setLoading(false);
            }}
            init={{
              height: 250,
              menubar: true,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | bold italic | alignleft aligncenter alignright | code",
              block_formats:
                "Paragraph=p; Heading 1=h1; Heading 2=h2; Code=pre; Quote=blockquote",
              content_style:
                "body { background-color: #242424; color: rgba(255, 255, 255, 0.87); }",
            }}
          />

          <BtnDiv>
            <button
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Publish
            </button>
            <button onClick={() => navigate("/")}>Go back</button>
          </BtnDiv>
        </Form>

        <h2>{message}</h2>
      </div>

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
