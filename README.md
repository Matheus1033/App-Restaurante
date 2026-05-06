# App Restaurante

Estrutura inicial do projeto separada em:

- **frontend**: React + TypeScript + Redux Toolkit + styled-components
- **backend**: Express + TypeScript + Prisma + MongoDB

## Como rodar

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

## Assets estáticos

Use a pasta `frontend/public/assets` para armazenar arquivos estáticos do app:

- `images/`
- `fonts/`
- `videos/`
- `misc/`
