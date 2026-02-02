# djay-front-end

Frontend for the djay service, built with React Router and Vite.

## Prerequisites

- Node.js 20+ (Dockerfile uses Node 20)
- npm (ships with Node)

## Setup

Install dependencies:

```bash
npm ci
```

If you need environment variables, create a `.env` file in the project root (check with the team for required keys).

## Development

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Dev setup script

Run the setup script (checks for Node/npm, installs deps, then starts dev):

```bash
bash dev-setup.sh
```


## Typecheck

```bash
npm run typecheck
```

## Scripts

- `npm run dev` — start the dev server

Desing
