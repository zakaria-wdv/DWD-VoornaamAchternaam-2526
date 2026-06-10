/* global searchMeals, getMealById, loadFavorites, saveFavorites, isFavorite, renderFavorites */

// Maximaal aantal zoekresultaten en ingrediënten dat we verwerken
const MAX_RESULTS = 20;
const MAX_INGREDIENTS = 20;

// DOM-shortcuts
const elFrmSearch = document.querySelector('#frmSearch');
const elInpSearch = document.querySelector('#inpSearch');
const elPFeedback = document.querySelector('#pFeedback');
const elSecDetail = document.querySelector('#secDetail');
const elDivDetail = document.querySelector('#divDetail');
const elBtnCloseDetail = document.querySelector('#btnCloseDetail');
const elDivResults = document.querySelector('#divResults');
const elDivFavorites = document.querySelector('#divFavorites');

// Toestandsvariabelen
let currentMeals = [];
let currentMeal = null;

// Toont of verbergt een feedbackbericht; isError bepaalt de kleurcode
function showFeedback(msg, isError) {
   elPFeedback.textContent = msg;
   elPFeedback.classList.toggle('hidden', msg === '');
   elPFeedback.classList.toggle('feedback-error', isError);
}

// Bouwt een HTML-string voor de ingrediëntenlijst van een recept
function buildIngredientList(meal) {
   let html = '';
   for (let i = 1; i <= MAX_INGREDIENTS; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
         const amount = measure ? measure.trim() : '';
         html += `<li>${amount} ${ingredient.trim()}</li>`;
      }
   }
   return html;
}

// Bouwt een HTML-string voor een receptkaart inclusief favorietenknop
function buildMealCard(meal, favorites) {
   const isFav = isFavorite(favorites, meal.idMeal);
   const favClass = isFav ? 'btn-favorite is-favorite' : 'btn-favorite';
   const favLabel = isFav ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten';
   const favIcon = isFav ? '★' : '☆';
   return `
      <article class="recipe-card" data-id="${meal.idMeal}">
         <img class="card-img" src="${meal.strMealThumb}" alt="${meal.strMeal}">
         <div class="card-body">
            <h3 class="card-title">${meal.strMeal}</h3>
            <p class="card-meta">${meal.strCategory} · ${meal.strArea || 'Onbekend'}</p>
            <div class="card-actions">
               <button class="btn-detail" data-id="${meal.idMeal}" type="button">
                  Bekijk recept
               </button>
               <button class="${favClass}" data-id="${meal.idMeal}" type="button"
                  aria-label="${favLabel}">${favIcon}</button>
            </div>
         </div>
      </article>
   `;
}

// Werkt de favorietenknoppen in het resultatenraster bij na een wijziging
function updateFavoriteButtons(favorites) {
   elDivResults.querySelectorAll('.btn-favorite').forEach(btn => {
      const isFav = isFavorite(favorites, btn.dataset.id);
      btn.classList.toggle('is-favorite', isFav);
      btn.textContent = isFav ? '★' : '☆';
      btn.setAttribute('aria-label', isFav ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten');
   });
}

// Rendert de zoekresultaten als kaarten in het resultatenraster
function renderMeals(meals) {
   const favorites = loadFavorites();
   elDivResults.innerHTML = meals.map(meal => buildMealCard(meal, favorites)).join('');
}

// Rendert de detailweergave van een recept in het detailpaneel
function renderDetail(meal) {
   const favorites = loadFavorites();
   const isFav = isFavorite(favorites, meal.idMeal);
   const favClass = isFav ? 'btn-favorite-detail is-favorite' : 'btn-favorite-detail';
   const favLabel = isFav ? '★ Uit favorieten' : '☆ Aan favorieten';
   elDivDetail.innerHTML = `
      <div class="detail-header">
         <img class="detail-img" src="${meal.strMealThumb}" alt="${meal.strMeal}">
         <div class="detail-meta">
            <h2 class="detail-title">${meal.strMeal}</h2>
            <p class="detail-category"><strong>Categorie:</strong> ${meal.strCategory}</p>
            <p class="detail-area"><strong>Regio:</strong> ${meal.strArea || 'Onbekend'}</p>
            <button class="${favClass}" data-id="${meal.idMeal}" type="button">
               ${favLabel}
            </button>
         </div>
      </div>
      <div class="detail-ingredients">
         <h3>Ingrediënten</h3>
         <ul class="ingredient-list">
            ${buildIngredientList(meal)}
         </ul>
      </div>
      <div class="detail-instructions">
         <h3>Instructies</h3>
         <p class="instructions-text">${meal.strInstructions}</p>
      </div>
   `;
}

// Laadt favorieten uit localStorage en rendert ze in het favorieten-raster
function renderFavoritesList() {
   const favorites = loadFavorites();
   renderFavorites(elDivFavorites, favorites);
   updateFavoriteButtons(favorites);
}

// Schakelt een recept in/uit de favorietenlijst en werkt alle weergaven bij
function toggleFavorite(meal) {
   let favorites = loadFavorites();
   if (isFavorite(favorites, meal.idMeal)) {
      favorites = favorites.filter(f => f.idMeal !== meal.idMeal);
   } else {
      favorites.push({
         idMeal: meal.idMeal,
         strMeal: meal.strMeal,
         strMealThumb: meal.strMealThumb,
         strCategory: meal.strCategory,
         strArea: meal.strArea
      });
   }
   saveFavorites(favorites);
   renderFavoritesList();
}

// Haalt receptdetails op via de API en toont het detailpaneel
async function showMealDetail(id) {
   try {
      const data = await getMealById(id);
      if (!data.meals) {
         showFeedback('Receptdetails niet gevonden.', true);
         return;
      }
      currentMeal = data.meals[0];
      renderDetail(currentMeal);
      elSecDetail.classList.remove('hidden');
   } catch (err) {
      showFeedback(err.message, true);
   }
}

// Verbergt het detailpaneel en wist de huidige receptselectie
function handleCloseDetail() {
   elSecDetail.classList.add('hidden');
   currentMeal = null;
}

// Schakelt het getoonde recept in/uit de favorieten; sluit overlay bij klik op achtergrond
function handleDetailFavoriteClick(event) {
   if (event.target === elSecDetail) {
      handleCloseDetail();
      return;
   }
   const btnFavorite = event.target.closest('.btn-favorite-detail');
   if (!btnFavorite || !currentMeal) {
      return;
   }
   toggleFavorite(currentMeal);
   renderDetail(currentMeal);
}

// Verwerkt klikken in het resultatenraster: details tonen of favoriet wisselen
function handleResultsGridClick(event) {
   const btnFavorite = event.target.closest('.btn-favorite');
   if (btnFavorite) {
      const meal = currentMeals.find(m => m.idMeal === btnFavorite.dataset.id);
      if (meal) {
         toggleFavorite(meal);
      }
      return;
   }
   const card = event.target.closest('.recipe-card');
   if (card) {
      showMealDetail(card.dataset.id);
   }
}

// Verwerkt klikken in het favorietenraster: verwijderen of details tonen
function handleFavoritesGridClick(event) {
   const btnRemove = event.target.closest('.btn-remove');
   if (btnRemove) {
      const updated = loadFavorites().filter(f => f.idMeal !== btnRemove.dataset.id);
      saveFavorites(updated);
      renderFavoritesList();
      return;
   }
   const card = event.target.closest('.recipe-card');
   if (card) {
      showMealDetail(card.dataset.id);
   }
}

// Verwerkt het verzenden van het zoekformulier
async function handleSearch(event) {
   event.preventDefault();
   const query = elInpSearch.value.trim();
   if (!query) {
      showFeedback('Vul een zoekterm in om te zoeken.', true);
      return;
   }
   showFeedback('Bezig met zoeken...', false);
   elDivResults.innerHTML = '';
   currentMeals = [];
   try {
      const data = await searchMeals(query);
      if (!data.meals) {
         showFeedback('Geen recepten gevonden voor deze zoekopdracht.', true);
         return;
      }
      showFeedback('', false);
      currentMeals = data.meals.slice(0, MAX_RESULTS);
      renderMeals(currentMeals);
   } catch (err) {
      showFeedback(err.message, true);
   }
}

// Event-koppeling
elFrmSearch.addEventListener('submit', handleSearch);
elBtnCloseDetail.addEventListener('click', handleCloseDetail);
elSecDetail.addEventListener('click', handleDetailFavoriteClick);
elDivResults.addEventListener('click', handleResultsGridClick);
elDivFavorites.addEventListener('click', handleFavoritesGridClick);

// Initialisatie: bestaande favorieten tonen bij opstarten
renderFavoritesList();
