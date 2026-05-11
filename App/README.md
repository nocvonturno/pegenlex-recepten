# PegEnLex Recepten

Een React + TypeScript single-page application voor het beheren van recepten, ingrediënten en boodschappenlijsten.

## Tech Stack

- **Frontend:** React 19, TypeScript 5
- **Build tool:** Vite 6
- **Styling:** Tailwind CSS (via CDN), Inter font (Google Fonts)
- **Backend:** REST API (standaard op `http://192.168.11.135:8090`)
- **Fallback:** In-memory mock data wanneer de backend niet bereikbaar is (Demo Mode)

## Features

- **Recepten CRUD** — Aanmaken, bewerken, bekijken en verwijderen van recepten met metadata (titel, beschrijving, bereiding, bereid/kooktijd, porties, moeilijkheidsgraad, keuken-type, tags, afbeelding)
- **Zoek & Filter** — Tekstzoekopdracht over receptnamen en keuken-types; sorteren op naam of keuken (A-Z / Z-A)
- **Paginatie** — 12 recepten per pagina
- **Ingrediënten Catalogus** — Beheer van basisingrediënten (naam, categorie, standaard eenheid, beschrijving) met zoek- en filterfunctionaliteit
- **Recept-Ingrediënt Integratie** — Zoek en voeg ingrediënten toe aan recepten uit de catalogus met hoeveelheid en eenheid overrides
- **Tags Systeem** — Voeg predefined tags toe aan recepten (bijv. "Italiaans", "Snel", "Vegetarisch")
- **Afbeeldingen Upload** — Upload afbeeldingen voor recepten (met fallback naar URL input)
- **Boodschappenlijsten** — Aanmaken, bewerken, verwijderen van boodschappenlijsten met active/inactive status
- **Boodschappenlijst Detail** — Voeg items toe via ingrediëntenzoekopdracht, drag-and-drop herschikking, markeer als voltooid
- **Bulk Toevoegen** — Voeg ingrediënten van een recept toe aan een actieve boodschappenlijst via een modal
- **Responsive Design** — Mobiele navigatie met bottom tabs

## Installation

```bash
cd App
npm install
```

## Running

```bash
npm run dev
```

De Vite dev server start op **port 3000**.

## Configuration

### Backend URL

De backend URL is hardcoded in [apiService.ts](apiService.ts) op `http://192.168.11.135:8090`. Pas deze aan naar je eigen backend endpoint.

### Environment Variables

Maak een `.env.local` bestand in de `App/` directory:

```
GEMINI_API_KEY=your_api_key
```

### Demo Mode

Wanneer de backend niet bereikbaar is, valt de app automatisch terug op mock data. Er verschijnt een "Demo Mode Geactiveerd" warning banner in de UI. Dit is handig voor ontwikkeling en prototyping zonder backend.

## Project Structure

```
App/
├── index.html                  # HTML entry point (Tailwind CDN, importmap)
├── index.tsx                   # React entry point
├── App.tsx                     # Root component (view routing, state management)
├── types.ts                    # TypeScript interfaces
├── apiService.ts               # API service layer (fetch + mock fallback)
├── components/
│   ├── Header.tsx              # Top navigation bar with search
│   ├── MobileNav.tsx           # Bottom mobile navigation
│   ├── RecipeCard.tsx          # Individual recipe card
│   ├── RecipeList.tsx          # Recipe grid with pagination
│   ├── RecipeDetail.tsx        # Full recipe view
│   ├── RecipeForm.tsx          # Create/edit recipe form
│   ├── IngredientManager.tsx   # Ingredient catalog table
│   ├── IngredientForm.tsx      # Create/edit ingredient form
│   ├── GroceryListManager.tsx  # Shopping lists grid
│   ├── GroceryListForm.tsx     # Create/edit grocery list form
│   ├── GroceryListDetail.tsx   # Detailed shopping list view
│   └── AddToGroceryListModal.tsx # Bulk-add ingredients modal
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.local
```

## Building

```bash
npm run build
```

Output wordt gegenereerd in de `dist/` directory.

```bash
npm run preview
```

## Docker

### Development

```bash
docker build -f Dockerfile .
```

Gebruikt `node:18`, exposeert port 3001, draait `npm run dev`.

### Production

```bash
docker build -f App/Dockerfile .
```

Two-stage build: Stage 1 gebruikt `node:20-alpine` om de app te bouwen, Stage 2 gebruikt `serve` om de statische output te hosten op port 3000.

## UI Language

De interface is in het Nederlands.
