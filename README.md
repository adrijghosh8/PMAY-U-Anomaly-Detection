# Anomaly Detector — Frontend Dashboard

A simple, static dashboard for the PMAY-U 2025 anomaly detection project.
It reads pre-generated JSON (converted from the Python backend's CSV
outputs) and displays the backend's actual research figures — it does
not run any models itself.

---

## 1. How to install

You need [Node.js](https://nodejs.org) 18 or later.

```bash
cd frontend
npm install
```

## 2. How to run

```bash
npm run dev
```

This starts a local dev server (Vite will print a URL, usually
`http://localhost:5173`). The page reloads automatically as you edit
files.

To build a static, deployable version:

```bash
npm run build
```

This outputs a `dist/` folder you can host anywhere (GitHub Pages,
Netlify, a plain web server, etc.). Preview the production build
locally with `npm run preview`.

---

## 3. Where the pages and components are

```
src/
  App.jsx              ← routes (URLs) for each page
  main.jsx             ← app entry point
  pages/                ← one file per page
    Overview.jsx
    Dataset.jsx
    ModelComparison.jsx
    AnomalyAnalysis.jsx
    TopAnomalies.jsx
    Explainability.jsx
    Methodology.jsx
  components/           ← reusable pieces used across pages
    Sidebar.jsx          navigation menu
    PageHeader.jsx        title + intro text at the top of a page
    StatCard.jsx           big-number cards (e.g. "5,113 Total Records")
    PriorityBadge.jsx      the colored Critical/High/Moderate/Low pill
    FigureCard.jsx          wraps an embedded research PNG with a caption
    HorizontalBarChart.jsx  reusable bar chart (feature influence, etc.)
    PriorityChart.jsx        priority-count bar chart on the Overview page
    Modal.jsx               popup used for the anomaly detail view
    Callout.jsx             the boxed disclaimer text
  data/                  JSON data used by the pages (see §4)
  utils/format.js        number/text formatting helpers
  styles/
    tokens.css            all colors, fonts, spacing — edit this to re-theme
    global.css            layout and component styles
public/
  figures/               the actual PNG figures copied from the backend
```

Each page imports the JSON files it needs directly, e.g.:

```js
import top20 from "../data/top20_anomalies.json";
```

There is no backend call at runtime — the dashboard is a static site.

---

## 4. Where the data comes from

The backend's `reports/tables/*.csv` and `experiments/results/*.csv`
files are the source of truth. They are converted into the JSON files
under `src/data/` by a small script:

```
scripts/prepare_data.py
research/                 ← a copy of the backend's reports/ and
                             experiments/results/ CSVs (input to the script)
```

To refresh the dashboard after the backend regenerates its results:

1. Copy the updated CSVs from the backend's `reports/tables/`,
   `reports/figures/`, and `experiments/results/` folders into this
   project's `research/` folder (and `public/figures/` for images).
2. Re-run the script:
   ```bash
   python scripts/prepare_data.py
   ```
3. Restart `npm run dev` (or rebuild).

No numbers are invented anywhere in the frontend — every statistic,
table row, and chart value in `src/data/*.json` traces back to one of
the backend's own CSV files. The PNG figures under `public/figures/`
are exactly what the backend's pipeline generated; the frontend does
not redraw them.

---

## 5. How to change colors

Open `src/styles/tokens.css`. Every color used anywhere in the app is
defined once there, for example:

```css
--color-accent: #2c5a8c;       /* the blue used for links, highlights */
--color-critical: #a3311a;      /* "Critical" priority badge */
```

Change a value and every component using that variable updates.

---

## 6. How to change text

- Page titles and intro paragraphs: edit the `<PageHeader>` block near
  the top of the relevant file in `src/pages/`.
- Table column headers: the `COLUMNS` array near the top of
  `src/pages/TopAnomalies.jsx`.
- Sidebar labels/order: the `NAV_ITEMS` array in
  `src/components/Sidebar.jsx`.
- Priority level descriptions: `PRIORITY_LEVELS` in
  `src/pages/AnomalyAnalysis.jsx`.
- Pipeline stage text: `STAGES` in `src/pages/Methodology.jsx`.

---

## 7. How to connect a backend/API later

Right now every page imports static JSON directly. To switch a page to
live data:

1. Replace the static import, e.g.
   ```js
   // before
   import top20 from "../data/top20_anomalies.json";

   // after
   const [top20, setTop20] = useState([]);
   useEffect(() => {
     fetch("/api/top-anomalies").then((r) => r.json()).then(setTop20);
   }, []);
   ```
2. Keep the JSON shape the same (see `scripts/prepare_data.py` for the
   exact field names each page expects) so the rest of the component
   doesn't need to change.
3. If the API lives on a different host during development, add a
   proxy in `vite.config.js`:
   ```js
   export default defineConfig({
     plugins: [react()],
     server: { proxy: { "/api": "http://localhost:8000" } },
   });
   ```

---

## Frontend architecture, in short

This is a client-only single-page app built with **React + Vite**,
using **React Router** for the seven pages and **Recharts** for the
two native charts (priority distribution, feature influence bars).
Everything else — tables, cards, badges, the pipeline diagram, the
figure captions — is plain HTML/CSS with no extra UI library, kept in
one shared stylesheet (`src/styles/global.css`) driven by a single
token file (`src/styles/tokens.css`).

Data flows one direction: backend CSVs → `scripts/prepare_data.py` →
JSON files in `src/data/` → imported directly by the page that needs
them. There is no client-side state management library — each page
just holds its own local UI state (selected tab, search text, sort
order) with React's built-in `useState`.

The result is intentionally simple: no CSS framework to learn, no
global state to trace, and a clear, traceable link from every number
on screen back to the CSV it came from.
