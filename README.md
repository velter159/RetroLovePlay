# 💖 Kawaii 8-Bit Retro Love & Anniversary Template 💖

Welcome to the **Retro Love & Anniversary Site**! This is a customizable, responsive, and kawaii 8-bit handheld console template built using **Angular v22** and **Tailwind CSS**. It is perfect for birthdays, Valentine's Day, anniversaries, or just to surprise a special someone!

## Features

- 🎮 **Handheld Console UI**: Beautiful Hello Kitty / arcade console wrapper with interactive controls (D-Pad, A/B buttons, Select/Start options).
- 🌸 **Interactive Chibi Minigame**: A retro side-scroller mini-game ("Chibi Run") with high scores, audio synthesis, and collision detection.
- 🍛 **Memory Cartridges Grid**: 4 customizable cartridges containing photo galleries and descriptions of your best moments together.
- 🎶 **Retro Audio Synth BGM**: KAWAII procedural music (Melody Synth) using native web audio synthesis (no heavy external assets required).
- 🧹 **Robust Codebase**: Zero memory leaks (automated cancellation loops), SSR-safe storage fallback, and fully responsive layouts.

---

## 🛠️ Customization Guide

You can customize the entire website by editing a single file: `src/app/config.ts`. Open this file to modify names, captions, love letters, and stories.

### Configuration Fields (`src/app/config.ts`)

| Property | Type | Description |
|---|---|---|
| `siteTitle` | `string` | Browser tab title. |
| `siteBranding` | `string` | Text logo displayed on the console screen (e.g. `ANGEL PLAY`, `RETRO PLAY`). |
| `p1Name` | `string` | Player name displayed in the bottom HUD status bar (e.g. `PLAYER 1`). |
| `landingHeadline` | `string` | Main heading on the arcade card screen. Supports `\n` newlines. |
| `landingSubtitle` | `string` | Sweet subtitle on the arcade card screen. |
| `homepageHeader` | `string` | Welcome message on the homepage. |
| `portraitImage` | `string` | Path to the picture inside the SELECT overlay (relative to `public/`). |
| `portraitTitle` | `string` | Header of the portrait frame (e.g. `🌸 SWEETEST BOND 🌸`). |
| `portraitCaption` | `string` | Label below the portrait picture (e.g. `YOU & ME`). |
| `portraitLoveNote` | `string` | Flashing pink note under the portrait (e.g. `FOREVER & ALWAYS 💖`). |
| `gameTitle` | `string` | Title of the mini-game. |
| `gameHighscoreKey` | `string` | The key used to save highscores in local storage. |
| `memories` | `MemoryCard[]` | Array of 4 memory cartridge configs (see details below). |

### Memory Card Structure

Each memory card in the `memories` array contains:
- `id` (1 to 4): Cartridge identifier.
- `title`: Cartridge title.
- `emoji`: Visual emoji shown on the cartridge sticker.
- `desc`: A short preview description.
- `details`: The main diary entry or love letter.
- `colorClass`: The background color class for the cartridge (e.g. `bg-pink-100`, `bg-blue-100`).
- `image1` to `image4`: Paths to retro JRPG pixel images (e.g. `images/first_date_1.png`).
- `image1Caption` to `image4Caption`: Short descriptions for each photo (supports suffix emojis).
- `underMaintenance` (optional): If set to `true`, clicking this cartridge loads a cute "8-bit construction/warning" hazard console screen.

### Changing Assets

- **Images**: Place your own photos/pixel art inside `public/images/`. Update the image paths in `src/app/config.ts`.
- **Browser Icon (Favicon)**: Replace `public/sakura.png` and `public/2favicon.ico` with your preferred favicon image.
- **Global Theme Colors**: If you want to change the pink retro colors, edit the Tailwind custom CSS themes in `src/styles.css` under the `@theme` block.

---

## 🚀 Running Locally

To serve the project locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Angular dev server:
   ```bash
   npm start
   ```
3. Open your browser and navigate to `http://localhost:4200/`.

---

## 🧪 Testing

To run unit tests:
```bash
npm run test
```

---

## 📦 Deployment Guide

This project is deployment-ready for static hosting sites like **Netlify**, **Vercel**, **GitHub Pages**, or **Render**.

### Build Settings
When setting up deployment on your provider, configure the build settings as follows:

- **Build Command**: `npm run build`
- **Publish Directory / Output Directory**: `dist/angel-site/browser`

#### Deployment Example (Netlify)
1. Push your code to GitHub.
2. Link your repository to Netlify.
3. Configure settings:
   - **Build Command**: `npm run build`
   - **Publish directory**: `dist/angel-site/browser`
4. Click **Deploy**. Done!
