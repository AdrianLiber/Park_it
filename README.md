# Park it! (Drava Forester)

A live leaderboard for the Park it! flag game. Players open the site on their phones; the scorekeeper enters scores from `/admin.html`.

- Leaderboard: `https://YOUR-PROJECT-ID.web.app/`
- Scorekeeper: `https://YOUR-PROJECT-ID.web.app/admin.html`

## Scoring

- Each round is 3 discs. Each disc's score is its distance from the flag in **cm**.
- A disc further than 3 m scores **300**. The scorekeeper types `#` (or taps **Miss**). Any number above 300 is also saved as 300.
- A round is the sum of the 3 discs (max 900).
- Each player can throw up to 3 rounds. Their lowest round is what shows on the leaderboard.
- Equal totals: the player with the closest single disc ranks higher.

## One-time setup (about 15 minutes)

1. **Create a Firebase project** at https://console.firebase.google.com (the free Spark plan is enough).
2. **Add a web app**: Project settings → General → Your apps → `</>` (Web). Copy the `firebaseConfig` values into `src/scripts/config/firebase-config.js`.
3. **Create the database**: Build → Firestore Database → Create database → Production mode → pick a location near you (e.g. `europe-west`).
4. **Create the scorekeeper login**: Build → Authentication → Get started → Sign-in method → enable **Email/Password**. Then Users → Add user, and enter the scorekeeper's email and a password.
5. **Allow that email to save scores**: open `firestore.rules` and add the scorekeeper's email to the list in `isScorekeeper()`.
6. **Set the project id**: in `.firebaserc`, replace `your-project-id` with your Firebase project id.
7. **Install the tools** (needs Node.js LTS from https://nodejs.org):
   ```
   npm install
   npm install -g firebase-tools
   firebase login
   ```
8. **Publish** from this folder:
   ```
   firebase deploy
   ```
   This builds the site into `dist/` (`npm run build` runs automatically first) and uploads it together with the database rules.
9. **Load the players**: open `/admin.html`, sign in, and click **Import 54 players**. This adds everyone registered for the event on PDGA (https://www.pdga.com/tour/event/97589). Walk-up players can be added with **Add a player**.

## Development

| Command            | What it does                                                  |
| ------------------ | ------------------------------------------------------------- |
| `npm run dev`      | Local dev server with live reload (http://localhost:5173)     |
| `npm run build`    | Builds the site into `dist/` (SCSS → CSS, bundled JS)         |
| `npm run preview`  | Serves the built `dist/` folder to check it before deploying  |
| `npm run lint`     | ESLint (JS), Stylelint (SCSS) and a Prettier formatting check |
| `npm run lint:fix` | Fixes what the linters can fix and formats everything         |

Code rules the linters enforce:

- No one-letter names (`id-length`): `player`, not `p`; `event`, not `e`.
- No JavaScript inside HTML: each page loads one module, `src/scripts/<page>/index.js`.
- Styles are SCSS; class names are kebab-case.

## Project structure

```
src/
├── index.html            Leaderboard everyone sees
├── admin.html            Scorekeeper page (sign-in required)
├── assets/images/        Poster (halloween-poster.png is the full-size original; the site uses the .jpg)
├── scripts/
│   ├── config/           Firebase project settings
│   ├── data/             The 54 event players from PDGA
│   ├── shared/           Used by both pages: Firebase, scoring/ranking, search, DOM helpers
│   ├── leaderboard/      Leaderboard page: translations (HR/EN), rendering, entry point
│   └── admin/            Scorekeeper page: sign-in, player list, score entry, add/import players
└── styles/
    ├── abstracts/        SCSS breakpoints and mixins (produce no CSS on their own)
    ├── base/             Colour/font tokens and page reset
    ├── components/       Buttons, forms, search, player chips, panels, toast
    ├── pages/            Leaderboard and scorekeeper layouts
    ├── themes/           Halloween theme for the leaderboard
    ├── leaderboard.scss  Stylesheet for index.html
    └── admin.scss        Stylesheet for admin.html
firestore.rules           Who can read and write (everyone reads, only the scorekeeper writes)
```
