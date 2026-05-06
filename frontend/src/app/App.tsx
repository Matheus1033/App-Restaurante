import { useMemo, useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useCart } from "../features/cart/cartContext";
import type { MenuItem } from "../features/cart/cartTypes";
import { formatCurrency } from "../features/cart/cartUtils";

type NavLink = "home" | "menu" | "about" | "contact";
type MenuCategory = "Burgers" | "Drinks" | "Desserts";

type FeaturedDish = {
  name: string;
  description: string;
  image: string;
};

type Review = {
  name: string;
  comment: string;
  stars: number;
};

const navItems: { label: string; href: `#${NavLink}` }[] = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Sobre", href: "#about" },
  { label: "Contato", href: "#contact" },
];

const featuredDishes: FeaturedDish[] = [
  {
    name: "X-Burger",
    description: "Uma Gostosura de Hamburguer com pão e carne :)",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Salmão Grelhado Atlântico",
    description: "Citrus glaze, herbed rice, roasted seasonal vegetables.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Bolo de Molten Chocolate",
    description: "Warm dark chocolate center with vanilla bean cream.",
    image:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Chicken-Burger",
    description: "Buttermilk chicken, pickles, house spicy mayo.",
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Limonada",
    description: "Fresh squeezed lemon, mint infusion, lightly sparkling.",
    image:
      "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Batata Rústica",
    description: "Crispy fries with parmesan, herbs, and garlic drizzle.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1400&q=80",
  },
];

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Smash",
    description: "Double patty, cheddar, house sauce",
    price: 14,
    category: "Burgers",
    image:
      "https://i.pinimg.com/1200x/c9/c5/01/c9c5013a47c78dde12d22a8659cdb945.jpg",
  },
  {
    id: "2",
    name: "Mushroom Melt",
    description: "Swiss cheese, mushrooms, caramelized onion",
    price: 16,
    category: "Burgers",
    image:
      "https://i.pinimg.com/1200x/a1/98/b6/a198b6496b29520230700caf94f44d25.jpg",
  },
  {
    id: "3",
    name: "Sparkling Berry",
    description: "Fresh berries, citrus, sparkling water",
    price: 6,
    category: "Drinks",
    image:
      "https://i.pinimg.com/1200x/cb/07/46/cb0746b50a01acf0d2dd94789a464c3b.jpg",
  },
  {
    id: "4",
    name: "Iced Mocha",
    description: "Single-origin coffee with dark chocolate",
    price: 5,
    category: "Drinks",
    image:
      "https://i.pinimg.com/1200x/4d/e0/68/4de068124212961d6481e6c631774053.jpg",
  },
  {
    id: "5",
    name: "Cheesecake",
    description: "Vanilla bean, berry compote",
    price: 8,
    category: "Desserts",
    image:
      "https://i.pinimg.com/1200x/de/a0/1a/dea01a87b4e0389b06ea43a19e6af30c.jpg",
  },
  {
    id: "6",
    name: "Tiramisu Cup",
    description: "Espresso-soaked layers and mascarpone",
    price: 9,
    category: "Desserts",
    image:
      "https://i.pinimg.com/1200x/6f/3b/1a/6f3b1adb610696d318e33dd76bb4312f.jpg",
  },
];

const reviews: Review[] = [
  {
    name: "Amanda P.",
    stars: 5,
    comment:
      "Reservation was easy, service was quick, and the food was incredible.",
  },
  {
    name: "Jordan R.",
    stars: 5,
    comment:
      "Best burger in town. Ordered online and pickup took less than 15 minutes.",
  },
  {
    name: "Chris L.",
    stars: 4,
    comment: "Great ambience and excellent desserts. Perfect for date night.",
  },
];

const GlobalStyle = createGlobalStyle`
* { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body {
    margin: 0;
    font-family: "Inter", system-ui, -apple-system, sans-serif;
    color: #f8fafc;
    background: #0f172a;
  }
  a { 
    color: inherit;
    text-decoration: none; 
    cursor: pointer;
  }
  button {
    cursor: pointer;
  }
`;

const Page = styled.main``;
const Section = styled.section`
  padding: 72px 20px;
  @media (min-width: 768px) {
    padding: 96px 48px;
  }
`;

const Container = styled.div`
  width: min(1120px, 100%);
  margin: 0 auto;
`;

const Navbar = styled.header<{ $solid: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: ${({ $solid }) =>
    $solid ? "rgba(2, 6, 23, 0.97)" : "transparent"};
  border-bottom: ${({ $solid }) =>
    $solid ? "1px solid rgba(255,255,255,0.1)" : "none"};
  transition: all 0.2s ease;
`;

const NavRow = styled(Container)`
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Hero = styled.section`
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(2, 6, 23, 0.65), rgba(2, 6, 23, 0.75)),
    url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
`;

const CartBtn = styled.button`
  position: relative;
  border: none;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
`;
const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #c2410c;
  color: #fff;
  border-radius: 999px;
  min-width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  font-size: 12px;
`;

const Card = styled.article`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
`;
const Img = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;
const Content = styled.div`
  padding: 12px;
`;
const Button = styled.button`
  border: none;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: #c2410c;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
`;
const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: ${({ $open }) => ($open ? "block" : "none")};
`;
const Sidebar = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: min(420px, 100%);
  background: rgba(2, 6, 23, 0.97);
  padding: 16px;
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
  transition: transform 0.25s ease;
  overflow: auto;
`;

export const App = () => {
  const {
    addToCart,
    decrement,
    increment,
    removeFromCart,
    items,
    subtotal,
    total,
    totalQuantity,
    isLoading,
    clearCart,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl = useMemo(() => {
    const lines = items.map(
      (item) =>
        `• ${item.name} x${item.quantity} = ${formatCurrency(item.quantity * item.price)}`,
    );
    const text = `Olá! Quero fazer este pedido:%0A${lines.join("%0A")}%0A%0ATotal: ${formatCurrency(total)}`;
    return `https://wa.me/?text=${text}`;
  }, [items, total]);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSolidNav, setSolidNav] = useState(false);
  const [hover, setHover] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Burgers");

  useEffect(() => {
    const onScroll = () => setSolidNav(window.scrollY > 32);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredMenu = useMemo(
    () => menuItems.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  return (
    <>
      <GlobalStyle />
      <Page>
        <Navbar $solid={isSolidNav}>
          <NavRow>
            <header>
              <strong>Santinho & Cia</strong>
            </header>
            <nav style={{ display: isMenuOpen ? "block" : "none" }}>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{ margin: "0 10px" }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <a href="https://wa.me/5521996754183">📞 (21) 99675-4183</a>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Abrir menu"
              >
                ☰
              </button>
              <CartBtn onClick={() => setIsOpen(true)}>
                🛒 Carrinho{totalQuantity > 0 && <Badge>{totalQuantity}</Badge>}
              </CartBtn>
              <Overlay $open={isOpen} onClick={() => setIsOpen(false)} />
              <Sidebar $open={isOpen}>
                <h2>Seu carrinho</h2>
                {isLoading && <p>Carregando carrinho...</p>}
                {!isLoading && items.length === 0 && (
                  <p>Seu carrinho está vazio.</p>
                )}
                {items.map((item) => (
                  <Card key={item.id}>
                    <Content>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <h4>{item.name}</h4>
                      <p>{formatCurrency(item.price)} cada</p>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() => decrement(item.id)}
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>
                        <strong>{item.quantity}</strong>
                        <button onClick={() => increment(item.id)}>+</button>
                        <button onClick={() => removeFromCart(item.id)}>
                          Remover
                        </button>
                      </div>
                      <small>
                        Subtotal: {formatCurrency(item.quantity * item.price)}
                      </small>
                    </Content>
                  </Card>
                ))}
                <hr />
                <p>
                  Subtotal: <strong>{formatCurrency(subtotal)}</strong>
                </p>
                <p>
                  Total: <strong>{formatCurrency(total)}</strong>
                </p>
                <div style={{ padding: "20px" }}>
                  <Button
                    as="a"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Send Order
                  </Button>
                  <button
                    onClick={clearCart}
                    style={{
                      marginLeft: "20px",
                      padding: "10px",
                      fontWeight: 700,
                    }}
                  >
                    Limpar carrinho
                  </button>
                </div>
              </Sidebar>
            </div>
          </NavRow>
        </Navbar>

        <Hero id="home">
          <Container>
            <h1
              style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)", marginBottom: 6 }}
            >
              Santinho & Cia
            </h1>
            <p style={{ maxWidth: 580, fontSize: "1.1rem", color: "#dbeafe" }}>
              Comida reconfortante preparada por chefs, entregue rapidamente ou
              servida fresca no nosso salão no centro.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 24,
              }}
            >
              <a
                href="#menu"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  background: hover ? "transparent" : "#f97316",
                  border: hover ? "1px solid #fff" : "1px solid #f97316",
                  padding: "12px 18px",
                  borderRadius: 999,
                }}
              >
                Peça Agora
              </a>
              <a
                href="#contact"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  border: hover ? "1px solid #f97316" : "1px solid #fff",
                  padding: "12px 18px",
                  borderRadius: 999,
                  backgroundColor: hover ? "#f97316" : "transparent",
                  color: hover ? "#000" : "#fff",
                }}
              >
                Reservar Mesa
              </a>
            </div>
          </Container>
        </Hero>

        <Section>
          <Container>
            <h2>Destaques</h2>
            <Grid>
              {featuredDishes.map((dish) => (
                <article
                  key={dish.name}
                  style={{
                    background: "#1e293b",
                    borderRadius: 16,
                    overflow: "hidden",
                    transition: "transform .2s",
                    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
                  }}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    style={{ width: "100%", height: 170, objectFit: "cover" }}
                  />
                  <div style={{ padding: 16 }}>
                    <h3>{dish.name}</h3>
                    <p style={{ color: "#cbd5e1" }}>{dish.description}</p>
                  </div>
                </article>
              ))}
            </Grid>
          </Container>
        </Section>

        <Section id="menu">
          <Container>
            <h2>Menu</h2>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                margin: "12px 0 20px",
              }}
            >
              {(["Burgers", "Drinks", "Desserts"] as MenuCategory[]).map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 999,
                      border: "none",
                      background:
                        activeCategory === category ? "#f97316" : "#334155",
                      color: "white",
                    }}
                  >
                    {category}
                  </button>
                ),
              )}
            </div>
            <Grid>
              {filteredMenu.map((item) => (
                <article
                  key={item.name}
                  style={{
                    background: "#1e293b",
                    padding: 16,
                    borderRadius: 12,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h3>
                      {item.name}{" "}
                      <span style={{ color: "#fb923c" }}>
                        R$: {item.price}.00
                      </span>
                    </h3>
                    <p style={{ color: "#cbd5e1" }}>{item.description}</p>
                  </div>
                  <div>
                    <img
                      src={item.image}
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                </article>
              ))}
            </Grid>
            <p>
              <a href="#" style={{ color: "#fb923c", fontWeight: 700 }}>
                Olhar Todo o Menu →
              </a>
            </p>
          </Container>
        </Section>

        <Section id="about">
          <Container>
            <h2>Sobre Nós</h2>
            <p>
              Erigimo-nos enquanto núcleo familiar que, imbuído de inequívoca
              vocação e de um inquebrantável zelo pela arte gastronômica,
              deliberou, com ponderação e desvelo, instituir o presente
              estabelecimento como expressão tangível de nossos mais elevados
              anseios e predileções. Movemo-nos pelo propósito de transmutar
              dedicação, tradição e apuro técnico em experiências sensoriais de
              rara distinção, de modo que cada visitante, ao nos honrar com sua
              presença, não apenas encontre satisfação, mas seja agraciado com
              um deleite autêntico, impregnado de significado, acolhimento e
              refinado apreço.
            </p>
          </Container>
        </Section>
        <Section>
          <Container>
            <h2>Comentários</h2>
            <Grid>
              {reviews.map((r) => (
                <article
                  key={r.name}
                  style={{
                    background: "#1e293b",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <p>{"★".repeat(r.stars)}</p>
                  <p>{r.comment}</p>
                  <small>{r.name}</small>
                </article>
              ))}
            </Grid>
          </Container>
        </Section>
        <Section id="contact">
          <Container>
            <h2>Localização & Contato</h2>
            <p>125 Market Street, New York, NY</p>
            <p>Mon–Thu: 11:00 AM – 10:00 PM | Fri–Sun: 11:00 AM – 11:30 PM</p>
            <p>
              <a
                href="https://wa.me/21996754183"
                style={{ display: "flex", gap: "10px", fontSize: "1.05rem" }}
                target="blank"
              >
                <img
                  src="https://i.pinimg.com/736x/ef/55/ac/ef55acaed134cf97d2a5f9f1e4815295.jpg"
                  alt="Whatsapp"
                  style={{
                    width: "50px",
                    height: "auto",
                    borderRadius: "999px",
                  }}
                />{" "}
                <p>(21) 99675-4183</p>
              </a>
            </p>
            <iframe
              title="Google map"
              src="https://www.google.com/maps?q=Times+Square+New+York&output=embed"
              width="100%"
              height="280"
              loading="lazy"
              style={{ border: 0, borderRadius: 12 }}
            />
          </Container>
        </Section>
        <footer
          style={{
            padding: "24px 20px",
            borderTop: "1px solid rgba(255,255,255,.15)",
          }}
        >
          <Container>
            <p>
              © {new Date().getFullYear()} Santinho & Cia. Todos os Direitos
              Reservados.
            </p>
          </Container>
        </footer>
        <a
          href="#menu"
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            background: "#ea580c",
            padding: "12px 16px",
            borderRadius: 999,
            fontWeight: 700,
            boxShadow: "0 10px 24px rgba(0,0,0,.3)",
          }}
        >
          Order Now
        </a>
      </Page>
    </>
  );
};
