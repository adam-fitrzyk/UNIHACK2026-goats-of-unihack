# grocery-compare

A web app that compares grocery prices between Woolworths and Coles in real time.

Built with Vite + React on the frontend and Python (FastAPI) on the backend.

---

## Project structure

```
grocery-compare/
├── frontend/          # Vite + React
│   ├── src/
│   ├── vite.config.js
│   └── package.json
├── backend/           # Python / FastAPI
│   ├── main.py
│   ├── scrapers/
│   │   ├── woolies.py
│   │   └── coles.py
│   └── requirements.txt
└── .vscode/           # Shared VS Code settings
```

---

## Prerequisites

Make sure you have the following installed:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org) (v18 or higher)
- [Python](https://python.org/downloads) (v3.11 or higher)

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/adam-fitrzyk/UNIHACK2026-goats-of-unihack
cd grocery-compare
```

### 2. Frontend setup

```bash
cd frontend
npm install
```

### 3. Backend setup

```bash
cd ../backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

---

## Running the project

In one terminal window:

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

In a second terminal window:

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:8000`.

---

## Contributing

### Pushing changes

```bash
git add .
git commit -m "describe what you changed"
git push
```

### Pulling latest changes

Always pull before starting work to get the latest changes from teammates:

```bash
git pull
```

### Getting access

You'll need to be added as a collaborator to push changes. Ask the repo owner to add you at:
**https://github.com/adam-fitrzyk/UNIHACK2026-goats-of-unihack/settings/collaborators**

---

## Notes

- Never commit the `backend/.venv/` folder or `frontend/node_modules/` — the `.gitignore` handles this automatically
- Both Woolworths and Coles render prices via JavaScript, so the scrapers use Playwright rather than a simple HTTP client
- The Vite dev server proxies `/api` requests to the FastAPI backend at `localhost:8000`
