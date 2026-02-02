# Academic Ledger Frontend

Frontend do sistema de gestão acadêmica para acompanhamento de TCCs.

## Stack

- **Framework:** Next.js 16 + React 19
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS 4
- **Componentes:** Radix UI + Phosphor Icons
- **Estado:** Zustand
- **Formulários:** React Hook Form + Zod

## Início Rápido

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Rodar em desenvolvimento
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://localhost:3001/api` |

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Servidor de produção |
| `pnpm lint` | Verificar código |

## Estrutura

```
app/           # Rotas e páginas (App Router)
components/    # Componentes reutilizáveis
hooks/         # Custom hooks
lib/           # Utilitários e configurações
public/        # Arquivos estáticos
```
