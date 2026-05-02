# Filmy Space 🎬

One repo for the full Telugu cinema gaming platform.

## Folder structure

```
filmy-space/
│
├── home.html          ← Hub homepage (start here)
├── index.html         ← Tollywood Cards gacha game       [COPY FROM old repo]
├── admin.html         ← Card editor (keep private)       [COPY FROM old repo]
├── cards.json         ← Card database                    [COPY FROM old repo]
├── profile.html       ← Player profile page              [NEW]
│
├── game/
│   ├── index.html     ← సినిమా క్రమం daily puzzle        [COPY FROM cinemaa repo]
│   ├── style.css                                         [COPY FROM cinemaa repo]
│   ├── app.js                                            [COPY FROM cinemaa repo]
│   └── puzzles.js                                        [COPY FROM cinemaa repo]
│
└── README.md
```

---

## Setup (one-time)

### Step 1 — Create a new GitHub repo
1. Go to github.com → New repository
2. Name it: `filmy-space`
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Upload files in this order

**Root files** (drag and drop together):
- `home.html`
- `profile.html`
- `index.html` ← from your Gacha-Trading-cards repo
- `admin.html` ← from your Gacha-Trading-cards repo
- `cards.json` ← from your Gacha-Trading-cards repo
- `README.md`

**Game subfolder** — click "create new file", type `game/index.html` in the filename box (GitHub auto-creates the folder), paste in the content. Repeat for `game/style.css`, `game/app.js`, `game/puzzles.js`.

### Step 3 — Deploy on Netlify
1. Go to netlify.com → Add new site → Import from GitHub
2. Select `filmy-space`
3. Build command: *(leave blank)*
4. Publish directory: *(leave blank or put `/`)*
5. Click **Deploy**

Your URLs will be:
- `yoursite.netlify.app/home.html` ← hub homepage
- `yoursite.netlify.app/` or `index.html` ← Tollywood Cards
- `yoursite.netlify.app/game/` ← సినిమా క్రమం
- `yoursite.netlify.app/profile.html` ← player profile

### Step 4 — Set home.html as the default page (optional)
In Netlify dashboard → Site settings → Build & deploy → Add a `_redirects` file to your repo root:
```
/  /home.html  200
```
Now `yoursite.netlify.app` shows the hub homepage.

---

## Why one repo?

Both games use `localStorage` to save data (card collections, puzzle scores, streaks).
`localStorage` is **per-domain** — two different Netlify sites = two different domains = they can't share data.

With one repo on one domain, the profile page can read both games' data seamlessly.

---

## Adding new puzzles

Edit `game/puzzles.js` — add a new entry to the `PUZZLES` array:

```js
[
  { name: "Movie Title", director: "Director Name", year: 1999 },
  { name: "Movie Title", director: "Director Name", year: 2010 },
  { name: "Movie Title", director: "Director Name", year: 2018 },
],
```

Rules: all three years must be different. Commit → Netlify auto-redeploys in ~30 seconds.

---

## Adding new cards

1. Visit `yoursite.netlify.app/admin.html`
2. Password: `tollywood2024` (change this in admin.html)
3. Add/edit cards with live preview
4. Click **Download cards.json**
5. Replace `cards.json` in repo → Netlify redeploys

---

## Navigation between pages

Each page has its own nav. The links are:

| From | To | Link |
|------|----|------|
| home.html | Cards game | `index.html` |
| home.html | Daily puzzle | `game/index.html` |
| home.html | Profile | `profile.html` |
| index.html | Hub | `home.html` |
| game/index.html | Hub | `../home.html` |
| profile.html | Hub | `home.html` |

---

## Future upgrades

### Real accounts (Supabase — free)
Right now data lives in localStorage (per device, per browser).
To sync across devices and make profiles shareable by URL:
1. Create free account at supabase.com
2. Add Google login with 3 lines of JS
3. On game events (pull, solve puzzle), write to Supabase
4. Profile reads from Supabase instead of localStorage

This is the next step when you're ready to grow users.

### Google AdSense / AdMob
- Web: Add AdSense banner between game sections
- Android: Wrap with Capacitor → use AdMob instead
- Best placements: between card pulls, on the result screen after puzzle

### Custom domain
Netlify dashboard → Domain settings → Add custom domain
Point `tollywoodhub.com` (or similar) here.
