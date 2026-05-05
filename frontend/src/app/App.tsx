import { useEffect, useMemo, useState } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

type AuthMode = "login" | "signup";
type Screen = "auth" | "home" | "cart";

type Dish = {
  name: string;
  description: string;
  price: string;
  image: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const dishes: Dish[] = [
  {
    name: "Risoto de Camarão",
    description: "Arroz arbóreo cremoso com camarão ao alho e limão-siciliano.",
    price: "R$ 49,90",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d29b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Filé ao Molho Madeira",
    description:
      "Filé mignon grelhado com batatas rústicas e legumes salteados.",
    price: "R$ 57,90",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Salmão Grelhado",
    description:
      "Salmão com crosta de ervas, arroz de amêndoas e salada fresca.",
    price: "R$ 54,90",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  },
];

const darkTheme = {
  colors: {
    background: "#121212",
    surface: "#1e1e1e",
    surfaceAlt: "#2b2b2b",
    text: "#f5f5f5",
    textMuted: "#cccccc",
    accent: "#d97706",
  },
};

const lightTheme = {
  colors: {
    background: "#f7f5f2",
    surface: "#ffffff",
    surfaceAlt: "#ece7df",
    text: "#1f2937",
    textMuted: "#6b7280",
    accent: "#c2410c",
  },
};

const GlobalStyle = createGlobalStyle`
* { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: Inter, system-ui, sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Page = styled.main`
  min-height: 100vh;
  padding: 24px;
`;

const AuthContainer = styled.section`
  min-height: calc(100vh - 48px);
  display: grid;
  place-items: center;
`;

const Card = styled.section`
  width: min(420px, 100%);
  padding: 24px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.2);
`;

const Field = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
`;

const Button = styled.button`
  border: none;
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
`;

const Toggle = styled.button`
  border: none;
  margin-top: 12px;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 12px 0;
`;

const Logo = styled.h1`
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 10px 12px;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
`;

const Carousel = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(260px, 1fr));
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const Slide = styled.article<{ $active: boolean }>`
  min-height: 220px;
  border-radius: 14px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
    url(${({ $active }) => ($active ? "" : "")});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: end;
  padding: 16px;
  color: #fff;
  transform: ${({ $active }) => ($active ? "scale(1.01)" : "scale(0.99)")};
  transition: transform 0.2s ease;
`;

const MenuGrid = styled.section`
  margin-top: 24px;
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const DishCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
`;

const DishImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

const DishContent = styled.div`
  padding: 12px;
`;

const SmallText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const App = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [screen, setScreen] = useState<Screen>("auth");
  const [isDark, setIsDark] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  const title = useMemo(
    () => (mode === "login" ? "Entrar na conta" : "Criar conta"),
    [mode],
  );

  useEffect(() => {
    if (screen !== "home") return;
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % dishes.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [screen]);

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

    try {
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
      setScreen("home");
      if (mode === "signup") setMode("login");
    } catch {
      setMessage("Servidor indisponível no momento.");
    }
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Page>
        {screen === "auth" && (
          <AuthContainer>
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
              {message && <SmallText>{message}</SmallText>}
            </Card>
          </AuthContainer>
        )}

        {screen === "home" && (
          <>
            <Header>
              <Logo>🍽️ Sabor da Casa</Logo>
              <HeaderActions>
                <IconButton onClick={() => setIsDark((current) => !current)}>
                  {isDark ? "☀️" : "🌙"}
                </IconButton>
                <IconButton onClick={() => setScreen("cart")}>🛒</IconButton>
              </HeaderActions>
            </Header>

            <h2>Pratos do dia</h2>
            <Carousel>
              {dishes.map((dish, index) => (
                <Slide
                  key={dish.name}
                  $active={activeSlide === index}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${dish.image})`,
                  }}
                >
                  <div>
                    <h3>{dish.name}</h3>
                    <p>{dish.price}</p>
                  </div>
                </Slide>
              ))}
            </Carousel>

            <h2>Cardápio</h2>
            <MenuGrid>
              {dishes.map((dish) => (
                <DishCard key={dish.name}>
                  <DishImage src={dish.image} alt={dish.name} />
                  <DishContent>
                    <h3>{dish.name}</h3>
                    <SmallText>{dish.description}</SmallText>
                    <p>{dish.price}</p>
                    <Button onClick={() => setScreen("cart")}>
                      Ir para o carrinho
                    </Button>
                  </DishContent>
                </DishCard>
              ))}
            </MenuGrid>
          </>
        )}

        {screen === "cart" && (
          <Card>
            <h2>Seu carrinho</h2>
            <SmallText>
              Seu prato foi adicionado com sucesso. Finalize seu pedido quando
              quiser.
            </SmallText>
            <Button onClick={() => setScreen("home")}>
              Voltar para o início
            </Button>
          </Card>
        )}
      </Page>
    </ThemeProvider>
  );
};
