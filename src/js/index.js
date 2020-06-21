import Search from './models/Search';
import { elements, renderLoader, removeLoader } from './views/base';
import * as searchView from './views/searchView';

/* Global state of the app, easy to be accessed globally
 * - Search objest
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes object
 */
const state = {};

const doSearch = async () => {
  // await can only be used in async
  const query = searchView.getQuery();
  if (query !== null) {
    searchView.clearQuery();
    searchView.clearRecipes();
    renderLoader(elements.recipeListParent);
    state.search = new Search(query);
    // wait Search.result to receive data
    await state.search.getResult();
    removeLoader();
    if (state.search.recipes !== undefined) {
      searchView.renderRecipes(state.search.recipes);
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); // so page won't refresh on submit
  doSearch();
});

elements.paginationBtnParent.addEventListener('click', (e) => {
  // event delegation
  const btn = e.target.closest('button');
  if (btn) {
    const goto = parseInt(btn.dataset.goto);
    searchView.clearRecipes();
    searchView.renderRecipes(state.search.recipes, goto);
  }
});
