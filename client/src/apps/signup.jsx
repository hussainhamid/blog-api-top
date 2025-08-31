import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../App";
import styled from "styled-components";

const BodyDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormDiv = styled.div`
  margin-top: 200px;
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid grey;
  border-radius: 20px;
  padding: 20px;
  margin: auto;
  text-align: left;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  background-color: #242424;
  border: none;
  border-bottom: 1px solid grey;
`;

const BtnDiv = styled.div`
  display: flex;
  gap: 20px;
`;

const WriterDiv = styled.div`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: #646cff;
  }

  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

const WriterInput = styled.input`
  margin-right: 10px;
`;

export default function Signup() {
  const [data, setData] = useState({
    userName: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [writer, setWriter] = useState(false);

  const { addToken, addUser, addWriter } = useContext(shopContext);

  const navigate = useNavigate();

  let token = localStorage.getItem("jwtToken");

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
            addUser(res.data.user.username);

            if (res.data.user.status === "reader") {
              addWriter(false);
            } else if (res.data.user.status === "writer") {
              addWriter(true);
            }

            navigate(`/${res.data.user.username}`);
          }
        } catch (err) {
          console.log("error in if statement homepage.jsx", err);
        }
      }
    };

    fetchMe();
  }, [addUser, token, addWriter, navigate]);

  async function signupFunc(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/sign-up",
        {
          username: data.userName,
          password: data.password,
          writer: writer,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.setItem("jwtToken", res.data.token);
        addToken(res.data.token);
        addUser(res.data.user.username);
        navigate(`/${res.data.user.username}`);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.log("error in sign up function in homepage.jsx", err);
    }
  }

  return (
    <>
      <BodyDiv>
        <FormDiv>
          <Form>
            <InputDiv>
              <label htmlFor="username">username</label>
              <Input
                type="text"
                className="username"
                value={data.userName}
                onChange={(e) => setData({ ...data, userName: e.target.value })}
              ></Input>
            </InputDiv>

            <InputDiv>
              <label htmlFor="password">password</label>
              <Input
                type="password"
                className="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              ></Input>
            </InputDiv>

            <WriterDiv>
              <WriterInput
                type="checkbox"
                className="writer"
                checked={writer}
                onChange={(e) => setWriter(e.target.checked)}
              ></WriterInput>
              <label htmlFor="writer">Become a writer</label>
            </WriterDiv>

            <BtnDiv>
              <button onClick={(e) => signupFunc(e)}>Create account</button>
              <button onClick={() => navigate("/log-in")}>log in</button>
            </BtnDiv>
          </Form>
        </FormDiv>
        <h2>{message}</h2>
      </BodyDiv>
    </>
  );
}
