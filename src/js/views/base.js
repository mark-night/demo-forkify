export const elements = {
  searchInput: document.querySelector('input.search__field'),
  searchForm: document.querySelector('form.search'),
  recipeListParent: document.querySelector('div.results'),
  recipeList: document.querySelector('ul.results__list'),
  paginationBtnParent: document.querySelector('div.results__pages'),
  recipeDetail: document.querySelector('div.recipe'),
  shoppingCart: document.querySelector('ul.shopping__list'),
  likesList: document.querySelector('ul.likes__list'),
  likesListMenu: document.querySelector('div.likes__field')
};

export const selectors = {
  loader: 'div.loader',
  recipes: 'a.results__link',
  recipeServings: 'span.recipe__info-data--people',
  recipeIngredientCount: 'div#recipe__count-',
  shoppingCartItemCount: 'input.shopping__count--value',
  shoppingItem: 'li.shopping__item',
  btnLike: 'button.recipe__love',
  likeList: 'ul.likes__list'
};

export const classStrings = {
  recipeHighlight: 'results__link--active',
  btnIncrease: 'btn-increase',
  btnDecrease: 'btn-decrease',
  btnAddToCart: 'recipe__btn-add',
  btnRemoveItem: 'shopping__delete'
};

export const renderLoader = parent => {
  const loader = `
    <div class="${selectors.loader.split('.')[1]}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

export const removeLoader = () => {
  const loader = document.querySelector(selectors.loader);
  // removeChild() approach seems to be more complex than remove(),
  // it is supported by more older browsers. The results are identical.
  if (loader) loader.parentElement.removeChild(loader);
};
