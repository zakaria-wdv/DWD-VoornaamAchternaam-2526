/* global BASE_URL */
/* exported searchMeals, getMealById */

// Zoekt recepten op trefwoord via het TheMealDB search-endpoint
async function searchMeals(query) {
   const resp = await fetch(`${BASE_URL}search.php?s=${encodeURIComponent(query)}`);
   if (!resp.ok) {
      throw new Error(`HTTP-fout: ${resp.status}`);
   }
   return resp.json();
}

// Haalt de volledige detailgegevens op van één recept via zijn ID
async function getMealById(id) {
   const resp = await fetch(`${BASE_URL}lookup.php?i=${id}`);
   if (!resp.ok) {
      throw new Error(`HTTP-fout: ${resp.status}`);
   }
   return resp.json();
}
