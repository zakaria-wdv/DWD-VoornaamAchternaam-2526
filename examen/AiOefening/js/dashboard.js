/* exported loadFavorites, saveFavorites, isFavorite, renderFavorites */

// Sleutel voor localStorage-opslag van favorieten
const LS_KEY = 'recipeFinder_favorites';

// Laadt de favorietenlijst uit localStorage en geeft een array terug
function loadFavorites() {
   const raw = localStorage.getItem(LS_KEY);
   return raw ? JSON.parse(raw) : [];
}

// Slaat de bijgewerkte favorietenlijst op in localStorage
function saveFavorites(favorites) {
   localStorage.setItem(LS_KEY, JSON.stringify(favorites));
}

// Controleert of een recept-ID in de favorietenlijst staat
function isFavorite(favorites, id) {
   return !!favorites.find(meal => meal.idMeal === id);
}

// Rendert de favorietenlijst als kaarten in het opgegeven container-element
function renderFavorites(container, favorites) {
   if (favorites.length === 0) {
      container.innerHTML = '<p class="empty-message">Nog geen favorieten opgeslagen.</p>';
      return;
   }
   container.innerHTML = favorites.map(meal => `
      <article class="recipe-card" data-id="${meal.idMeal}">
         <img class="card-img" src="${meal.strMealThumb}" alt="${meal.strMeal}">
         <div class="card-body">
            <h3 class="card-title">${meal.strMeal}</h3>
            <p class="card-meta">${meal.strCategory} · ${meal.strArea || 'Onbekend'}</p>
            <div class="card-actions">
               <button class="btn-detail" data-id="${meal.idMeal}" type="button">
                  Bekijk recept
               </button>
               <button class="btn-remove" data-id="${meal.idMeal}" type="button"
                  aria-label="Verwijder uit favorieten">✕</button>
            </div>
         </div>
      </article>
   `).join('');
}
