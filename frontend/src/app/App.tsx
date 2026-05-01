import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../features/counter/counterSlice";
import type { RootState } from "./store";
import { theme } from "../styles/theme";

const GlobalStyle = createGlobalStyle`
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
`;

const Button = styled.button`
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  color: white;
  background: ${({ theme }) => theme.colors.accent};
`;

export const App = () => {
  const value = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <section>
          <h1>Frontend base pronto ✅</h1>
          <p>Contador Redux: {value}</p>
          <Button onClick={() => dispatch(increment())}>Incrementar</Button>
        </section>
      </Container>
    </ThemeProvider>
  );
};
