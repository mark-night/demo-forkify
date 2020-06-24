import Search from './models/Search';
import Recipe from './models/Recipe';
import Cart from './models/Cart';
import Like from './models/Like';
import {
  renderLoader,
  removeLoader,
  elements,
  classStrings,
  selectors
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as cartView from './views/cartView';
import * as likeView from './views/likeView';

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
    // new instance for every query, don't bother with updating the old one
    state.search = new Search();
    // wait Search.result to receive data
    await state.search.getResult(query);
    removeLoader();
    if (state.search.recipes !== undefined) {
      searchView.renderRecipes(state.search.recipes);
    }
  }
};

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
    recipeView.renderRecipe(
      state.recipe,
      state.like ? state.like.isLiked(id) : false
    );
  }
};

/**
 * CART CONTROLLER
 */
const cartControl = () => {
  // state.cart is created/restored on page load
  state.recipe.ingredients.forEach(ingredient => {
    const item = state.cart.addItem(ingredient);
    cartView.renderItem(item);
  });
};

/**
 * LIKE CONTROLLER
 */
const likeControl = () => {
  // state.like created/restored on page load, no need to check
  const id = state.recipe.id;
  if (state.like.isLiked(id)) {
    state.like.removeLike(id);
    likeView.removeLike(id);
  } else {
    const like = state.like.addLike(state.recipe);
    likeView.renderLike(like);
  }
  likeView.toggleLikesMenu(state.like.numLikes());
  likeView.toggleLikeIcon(state.like.isLiked(id));
};

/**
 * EVENT LISTENERS
 *
 * ON PAGE LOAD/REFRESH
 * - fetch recipe according to url
 * - restore previous status from current session or init
 */
window.addEventListener('load', () => {
  // restore recipes list from sessionStorage
  state.search = new Search();
  state.search.restore();
  if (state.search.recipes) {
    let page = parseInt(sessionStorage.getItem('page'), 10);
    if (!page) page = 1;
    searchView.renderRecipes(state.search.recipes, page);
  }
  // now we have a chance to highlight current recipe in search list.
  fetchRecipe();
  // restore likes from sessionStorage
  state.like = new Like();
  state.like.restore();
  likeView.toggleLikesMenu(state.like.numLikes());
  state.like.likes.forEach(like => likeView.renderLike(like));
  // restore cart items from sessionStorage
  state.cart = new Cart();
  state.cart.restore();
  state.cart.items.forEach(item => cartView.renderItem(item));
});

/**
 * ON URL CHANGE
 */
window.addEventListener('hashchange', fetchRecipe);

/**
 * events for RECIPES QUERY and LIST
 */
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
    // if some recipe is shown now, highlight it in the list as needed
    if (state.recipe) {
      searchView.highlightCurrent(state.recipe.id);
    }
  }
});

/**
 * event in CART SECTION
 */
elements.shoppingCart.addEventListener('click', e => {
  const id = e.target.closest(selectors.shoppingItem).dataset.id;
  if (
    e.target.matches(
      `.${classStrings.btnRemoveItem}, .${classStrings.btnRemoveItem} *`
    )
  ) {
    // delete button
    state.cart.deleteItem(id);
    cartView.removeItem(id);
  } else if (e.target.matches(selectors.shoppingCartItemCount)) {
    // the count input bodification
    const newCount = parseFloat(e.target.value);
    if (newCount <= 0) {
      // delete item if count drop to zero
      state.cart.deleteItem(id);
      cartView.removeItem(id);
    } else {
      state.cart.updateCount(id, newCount);
    }
  }
});

/**
 * events in RECIPE DETAIL SECTION
 * - recipe serving change
 * - add to shopping list
 * - like
 */
elements.recipeDetail.addEventListener('click', e => {
  const el = e.target;
  switch (true) {
    case el.matches(
      `.${classStrings.btnDecrease}, .${classStrings.btnDecrease} *`
    ):
      // recipe serving decrease
      state.recipe.updateServings('dec');
      recipeView.updateRecipeDetail(state.recipe);
      break;
    case el.matches(
      `.${classStrings.btnIncrease}, .${classStrings.btnIncrease} *`
    ):
      // recipe serving increase
      state.recipe.updateServings('inc');
      recipeView.updateRecipeDetail(state.recipe);
      break;
    case el.matches(
      `.${classStrings.btnAddToCart}, .${classStrings.btnAddToCart} *`
    ):
      // add to shopping list
      cartControl();
      break;
    case el.matches(`${selectors.btnLike}, ${selectors.btnLike} *`):
      // like
      likeControl();
      break;
  }
});
