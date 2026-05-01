import { useMemo, useState } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../features/counter/counterSlice";
import type { RootState } from "./store";
import { theme } from "../styles/theme";

type AuthMode = "login" | "signup";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Inter, system-ui, sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Container = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
`;

const Card = styled.section`
  width: min(420px, 100%);
  padding: 24px;
  border-radius: 12px;
  background: white;
  color: #1f2937;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.15);
`;

const Field = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  box-sizing: border-box;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.65rem;
`;

const Subtitle = styled.p`
  margin: 8px 0 24px;
  color: #c7c7c7;
`;

const Button = styled.button`
  border: none;
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
`;

const Toggle = styled.button`
  border: none;
  margin-top: 12px;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
`;

const LoginButton = styled.button<{ $variant: "google" | "facebook" }>`
  width: 100%;
  border: 0;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  transition: transform 0.15s ease;
  background: ${({ $variant }) =>
    $variant === "google" ? "#ea4335" : "#1877f2"};

  &:hover {
    transform: translateY(-1px);
  }
`;

const Note = styled.small`
  display: block;
  margin-top: 14px;
  color: #969696;
`;

export const App = () => {
  const value = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const title = useMemo(
    () => (mode === "login" ? "Entrar na conta" : "Criar conta"),
    [mode],
  );

  const clearForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
  };

  const submit = async () => {
    const endpoint = mode === "login" ? "/auth/login" : "/auth/sign-up";
    const payload =
      mode === "login" ? { email, password } : { name, phone, email, password };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(data.message ?? "Não foi possível concluir a solicitação.");
      return;
    }

    setMessage(data.message ?? "Sucesso");
    clearForm();

    if (mode === "signup") {
      setMode("login");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Card>
          <h1>{title}</h1>
          {mode === "signup" && (
            <>
              <Field
                placeholder="Nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Field
                placeholder="Telefone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </>
          )}
          <Field
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Field
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button onClick={submit}>
            {mode === "login" ? "Entrar" : "Cadastrar"}
          </Button>
          <Toggle
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login"
              ? "Não tem conta? Cadastre-se"
              : "Já tem conta? Fazer login"}
          </Toggle>
          {message && <p>{message}</p>}
        </Card>
      </Container>
    </ThemeProvider>
  );
};
