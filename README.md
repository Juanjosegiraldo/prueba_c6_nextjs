# RecetasApp

Recipe catalog application built with **Next.js 16 (App Router)**, **TypeScript**, **Mongoose**, **MongoDB Atlas** and **HeroUI**.

It lets you browse a recipe catalog, view the detail of each recipe, register and log in, and save recipes as favorites (protected by session). A welcome email is sent on registration.

## Live demo

The app is deployed on Vercel: **[https://prueba-c6-nextjs.vercel.app/](https://prueba-c6-nextjs.vercel.app/)**

## Features

- Recipe catalog on the home page (visible without logging in).
- Recipe card (`RecipeCard`) that receives its data through props.
- Recipe detail via the dynamic route `/recipes/[id]` with ingredients, steps and servings.
- Register and login with hashed passwords (bcrypt).
- Persistent session and the user name shown in the navbar.
- Protected favorites: they require a session and are shown in `/favorites`.
- Service layer decoupled from the UI.
- Welcome email on registration.

## Requirements

- Node.js 18 or higher.
- A MongoDB Atlas account (or a MongoDB instance).

## Installation

```bash
npm install
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

To populate the catalog with sample recipes, send a `POST` request to `/api/seed`.

## Environment variables

Create a `.env.local` file based on `.env.example`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string. |
| `NEXT_PUBLIC_BASE_URL` | App base URL (defaults to `http://localhost:3000`). |
| `PEXELS_API_KEY` | Pexels key for the seed images. If not set, placehold.co images are used. |
| `MAIL_USER` | Gmail account that sends the welcome email. |
| `MAIL_PASS` | Google App Password (16 characters, requires 2-step verification). |
| `SEED_SECRET` | Secret key required (via the `x-seed-secret` header) to run `POST /api/seed`. The endpoint is locked if it is not set. |

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run build` | Build the production version. |
| `npm run start` | Start the production version. |
| `npm run lint` | Run the linter. |

## Deployment

The app is deployed on Vercel at **[https://prueba-c6-nextjs.vercel.app/](https://prueba-c6-nextjs.vercel.app/)**.

To deploy your own instance:

1. Push the repository to GitHub and import it in Vercel (it auto-detects Next.js).
2. In **Settings → Environment Variables**, add `MONGODB_URI`, `MAIL_USER`, `MAIL_PASS` and `PEXELS_API_KEY`.
3. In **MongoDB Atlas → Network Access**, allow access from any IP (`0.0.0.0/0`), since Vercel uses dynamic IPs.
4. Deploy, then send a `POST` to `/api/seed` once to populate the catalog.

## Author

- **Name:** Juan Jose Giraldo Muñoz
- **Clan:** Thompson
- **Email:** juan.jo15@hotmail.com
- **ID:** CC 1037662885
