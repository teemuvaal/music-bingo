# Music Bingo Generator

A web app for generating printable music bingo cards from a Spotify playlist CSV export. Upload your playlist, configure the grid, and print a unique card for every player at your quiz night.

## Features

- Upload a Spotify playlist exported via [Exportify](https://exportify.net)
- Configure grid size (3×3, 4×4, 5×5), number of cards, and song pool size
- Show artist name, track name, or both on each cell
- Estimates how many songs you need to play before someone gets bingo
- Print all cards as a PDF — 2 per page, ready to hand out

## Requirements

- Node.js 18+
- pnpm (or npm/yarn)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create `.env.local`

Create a file called `.env.local` in the project root with the following variables:

```env
# Login credentials for the app (simple single-user auth)
APP_USERNAME=admin
APP_PASSWORD=your-password-here

# Secret used to sign session JWTs — generate a random string, e.g.:
# openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-here
```

| Variable | Required | Description |
|---|---|---|
| `APP_USERNAME` | No | Username for login. Defaults to `admin` if not set. |
| `APP_PASSWORD` | No | Password for login. Defaults to `bingo2024` if not set. |
| `NEXTAUTH_SECRET` | **Yes** | Random secret for signing session tokens. Must be set in production. |

To generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the login page — sign in with the credentials from your `.env.local`.

## Getting a Spotify playlist CSV

1. Go to [exportify.net](https://exportify.net)
2. Log in with your Spotify account
3. Click **Export** next to the playlist you want
4. Save the `.csv` file

The app expects the Exportify format. Columns used:
- Column 2 (index 1): Track Name
- Column 4 (index 3): Artist Name(s)

Other CSV formats will also work if the file has a header row containing the words `track` and `artist` — the parser will auto-detect the right columns.

## Printing cards

1. Upload your CSV and configure the settings
2. Click **Generate Cards**
3. Click **Print / Save as PDF**
4. In the browser print dialog, choose **Save as PDF** and print

Cards are formatted 2-up on A4, with borders sized for easy reading when handed out at a quiz.

## Project structure

```
src/
  app/
    app/          # Protected generator page and layout
    login/        # Login page
    globals.css   # Global styles + print media query
  components/
    AppNav.tsx    # Top navigation bar
    BingoCard.tsx # Individual bingo card component
  lib/
    auth.ts       # NextAuth config (credentials provider)
    bingo.ts      # CSV parsing, card generation, bingo estimate
```

## Building for production

```bash
pnpm build
pnpm start
```

Make sure `NEXTAUTH_SECRET` is set to a strong random value in your production environment.
