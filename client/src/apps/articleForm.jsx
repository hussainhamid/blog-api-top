import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

export default function Article() {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = editorRef.current.getContent();

    console.log({ title, content });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
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
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue="<p>Start writing...</p>"
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
          <button>Publish</button>
          <button onClick={() => navigate("/")}>Go back</button>
        </BtnDiv>
      </Form>
    </>
  );
}
