import Search from './models/Search';
import Recipe from './models/Recipe';
import {
  elements,
  classStrings,
  renderLoader,
  removeLoader
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/**
 * Global state of the app, easy to be accessed globally
 * - Search objest
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes object
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const searchRecipes = async () => {
  // await can only be used inside an async function;
  // await shall be used on a Promise, doesn't make sense otherwaise;
  // async function returns a resolved Promise. (resolved with the value
  // returned by the function, or undefined if absent.)
  const query = searchView.getQuery();
  if (query !== null) {
    // prepare UI
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

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault(); // so page won't refresh on submit
  searchRecipes();
});

elements.paginationBtnParent.addEventListener('click', e => {
  // event delegation
  const btn = e.target.closest('button');
  if (btn) {
    const goto = parseInt(btn.dataset.goto);
    searchView.clearRecipes();
    searchView.renderRecipes(state.search.recipes, goto);
  }
});

/**
 * RECIPE CONTROLLER
 */
const fetchRecipe = async () => {
  // get ID from url
  const id = window.location.hash.replace('#', '');
  if (id) {
    // prepare UI
    if (state.search) {
      searchView.highlightCurrent(id);
    }
    recipeView.clearRecipe();
    renderLoader(elements.recipeDetail);
    // create recipe object and get data ready
    state.recipe = new Recipe(id);
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();
    state.recipe.calcTime();
    state.recipe.calcServings();
    // render the recipe
    removeLoader();
    recipeView.renderRecipe(state.recipe);
  }
};

// event listener for url change and page refresh
['hashchange', 'load'].forEach(e => {
  window.addEventListener(e, fetchRecipe);
});

// event listener for servings buttons click
elements.recipeDetail.addEventListener('click', e => {
  let type;
  if (
    e.target.matches(
      `.${classStrings.btnDecrease}, .${classStrings.btnDecrease} *`
    )
  ) {
    type = 'dec';
  } else if (
    e.target.matches(
      `.${classStrings.btnIncrease}, .${classStrings.btnIncrease} *`
    )
  ) {
    type = 'inc';
  }
  state.recipe.updateServings(type);
  recipeView.updateRecipeDetail(state.recipe);
});
