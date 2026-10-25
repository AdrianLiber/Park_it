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
2. **Add a web app**: Project settings → General → Your apps → `</>` (Web). Copy the `firebaseConfig` values into `public/firebase-config.js`.
3. **Create the database**: Build → Firestore Database → Create database → Production mode → pick a location near you (e.g. `europe-west`).
4. **Create the scorekeeper login**: Build → Authentication → Get started → Sign-in method → enable **Email/Password**. Then Users → Add user, and enter the scorekeeper's email and a password.
5. **Allow that email to save scores**: open `firestore.rules` and replace `scorekeeper@example.com` with the scorekeeper's email.
6. **Set the project id**: in `.firebaserc`, replace `your-project-id` with your Firebase project id.
7. **Install the Firebase tools** (needs Node.js LTS from https://nodejs.org):
   ```
   npm install -g firebase-tools
   firebase login
   ```
8. **Publish** from this folder:
   ```
   firebase deploy
   ```
   This uploads the website and the database rules.
9. **Load the players**: open `/admin.html`, sign in, and click **Import 54 players**. This adds everyone registered for the event on PDGA (https://www.pdga.com/tour/event/97589). Walk-up players can be added with **Add a player**.

To try it on your computer before publishing, run `firebase emulators:start --only hosting` and open http://localhost:5000. (Opening the HTML file directly by double-clicking won't work.)

## Files

| File | What it is |
| --- | --- |
| `public/index.html` | Leaderboard everyone sees |
| `public/admin.html` | Scorekeeper page (sign-in required) |
| `public/common.js` | Firebase connection and the scoring / ranking logic |
| `public/players-data.js` | The 54 event players from PDGA |
| `public/firebase-config.js` | Your Firebase project settings |
| `firestore.rules` | Who can read and write (everyone reads, only the scorekeeper writes) |
