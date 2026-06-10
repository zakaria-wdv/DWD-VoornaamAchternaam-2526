# RecipeFinder — Documentatie

## Plan van aanpak

### Fase 0 – Projectopzet
- Mapstructuur aanmaken: `project/`, `project/css/`, `project/js/`
- Lege bestanden aanmaken: `index.html`, `style.css`, `config.js`, `api.js`, `dashboard.js`, `app.js`
- Validatiescripts controleren (ESLint, html-validate, stylelint)

### Fase 1 – Zoekfunctie en kaartweergave
- Zoekformulier in HTML
- `searchMeals(query)` in `api.js`
- Receptkaarten renderen met naam, afbeelding, categorie en regio
- Feedbackberichten: lege invoer, geen resultaten, HTTP-fout
- Favorietenknop op kaart (visueel zichtbaar)

### Fase 2 – Detailweergave
- Klikken op kaart opent detailpaneel
- Ingrediënten met hoeveelheden (loop strIngredient1–20)
- Instructies tonen
- Detailpaneel sluiten via knop

### Fase 3 – Favorieten met localStorage
- Favorieten toevoegen/verwijderen
- Persisteren via `localStorage` (JSON.stringify/parse)
- Favorieten renderen in apart blok
- Visuele markering van favoriete recepten

---

## Werksessies

### Sessie 1 — 2026-06-10
**Gespreksverloop:** Opdracht ontvangen om RecipeFinder te bouwen met TheMealDB API.
Beslissingen:
- Projectstructuur gevolgd zoals in CLAUDE.md beschreven.
- `getMealById` (lookup-endpoint) gebruikt voor detailweergave zodat ook favorietenkaarten detail tonen.
- `dashboard.js` zonder eigen event-koppeling; event delegation volledig in `app.js`.
- Fase 0 t/m 3 geïmplementeerd in één sessie:
  - Zoekformulier met feedbackberichten (leeg, geen resultaten, HTTP-fout, laden).
  - Receptkaarten met naam, afbeelding, categorie, regio, data-id en favorietenknop.
  - Detailoverlay (classList.remove/add 'hidden'); sluit via knop of klik op achtergrond.
  - Ingrediëntenlijst: loop strIngredient1–20, lege items overgeslagen.
  - Favorieten: toevoegen/verwijderen, localStorage-persistentie, ★/☆ visuele markering.
  - Favorietenkaarten hebben ook "Bekijk recept"-knop (vereiste: detailknop op kaart).
- ESLint-config uitgebreid met `examen/project/js/*.js` voor correcte script-modus.
