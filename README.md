# 🧭 Smart Campus Navigation — MERN + Leaflet

> DTI Week 2 Project — Full-stack campus navigation app built on the user personas, ideation board, and feature priority matrix.

---

## 📁 Project Structure

```
smart-campus-nav/
├── backend/          ← Express + Mongoose REST API
│   ├── models/
│   │   ├── Location.js
│   │   └── Marker.js
│   ├── routes/
│   │   ├── locations.js  (CRUD + /seed/demo)
│   │   ├── markers.js    (CRUD + /seed/demo)
│   │   └── search.js     (regex search)
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/         ← React + React-Leaflet SPA
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/
    │   │   ├── MapPage.js         🗺️  Interactive Leaflet map + search sidebar
    │   │   ├── LocationsPage.js   🏢  Grid view of all locations
    │   │   ├── PersonasPage.js    👤  3 DTI user personas (interactive tabs)
    │   │   └── AdminPage.js       ⚙️  Add locations form + data tables
    │   ├── utils/
    │   │   └── api.js             axios helpers
    │   ├── App.js
    │   ├── App.module.css
    │   └── index.css
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Start the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your MONGODB_URI if needed
npm run dev
# → Server running on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
# → App running on http://localhost:3000
```

### 3. Load Demo Data

Once both are running:
- Go to `http://localhost:3000`
- Click **"🌱 Load Demo Data"** in the sidebar (Map page)
- 12 campus locations + 6 map markers will be seeded instantly

---

## 🗺️ Features

| Feature | Description |
|---|---|
| **Interactive Map** | Leaflet dark-theme map with custom SVG pins by location type |
| **Live Search** | Debounced search across name, block, room, tags, facilities |
| **Type Filter** | Filter by classroom, lab, office, hall, canteen, library, admin |
| **Fly-to Navigation** | Click any location → map animates to that position |
| **Rich Popups** | Popup cards with facilities, description, room info |
| **Locations Grid** | Browse all locations as cards with delete support |
| **User Personas** | Interactive tabbed persona cards (Goals / Pains / Tech / Needs) |
| **Admin Panel** | Add locations via form, view/delete all data in tables |
| **Demo Seed** | One-click load of realistic campus data |

---

## 🔌 API Endpoints

### Locations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/locations` | Get all (supports `?type=lab&block=A&floor=1`) |
| GET | `/api/locations/:id` | Get single location |
| POST | `/api/locations` | Create location |
| PUT | `/api/locations/:id` | Update location |
| DELETE | `/api/locations/:id` | Delete location |
| POST | `/api/locations/seed/demo` | Seed 12 demo locations |

### Markers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/markers` | Get all active markers |
| POST | `/api/markers` | Create marker |
| DELETE | `/api/markers/:id` | Delete marker |
| POST | `/api/markers/seed/demo` | Seed 6 demo markers |

### Search
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/search?q=lab` | Search by name, block, room, tags |
| GET | `/api/search?q=cse&type=lab` | Search with type filter |

---

## 👤 User Personas (from DTI Research)

1. **Arjun Reddy** — 1st Year CSE student, gets lost finding labs
2. **Lakshmi Devi** — Visiting parent, needs Telugu-language simple UI
3. **Dr. Priya Sharma** — New faculty, needs to share room locations with students

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, React-Leaflet 4, Leaflet 1.9, Axios, CSS Modules
- **Backend**: Express.js, Mongoose, MongoDB
- **Map Tiles**: OpenStreetMap (dark-filtered via CSS)
- **Fonts**: Syne (headings) + DM Sans (body) from Google Fonts
