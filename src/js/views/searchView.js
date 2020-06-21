import { elements } from './base';

export const getQuery = () => {
  const allowedQueries = [
    'carrot',
    'broccoli',
    'asparagus',
    'cauliflower',
    'corn',
    'cucumber',
    'green pepper',
    'lettuce',
    'mushrooms',
    'onion',
    'potato',
    'pumpkin',
    'red pepper',
    'beetroot',
    'brussel sprouts',
    'peas',
    'zucchini',
    'radish',
    'sweet potato',
    'artichoke',
    'leek',
    'cabbage',
    'celery',
    'chili',
    'garlic',
    'basil',
    'coriander',
    'parsley',
    'dill',
    'rosemary',
    'oregano',
    'cinnamon',
    'saffron',
    'green bean',
    'bean',
    'chickpea',
    'lentil',
    'apple',
    'apricot',
    'avocado',
    'banana',
    'blackberry',
    'blackcurrant',
    'blueberry',
    'boysenberry',
    'cherry',
    'coconut',
    'fig',
    'grape',
    'grapefruit',
    'kiwifruit',
    'lemon',
    'lime',
    'lychee',
    'mandarin',
    'mango',
    'melon',
    'nectarine',
    'orange',
    'papaya',
    'passion fruit',
    'peach',
    'pear',
    'pineapple',
    'plum',
    'pomegranate',
    'quince',
    'raspberry',
    'strawberry',
    'watermelon',
    'salad',
    'pizza',
    'pasta',
    'popcorn',
    'lobster',
    'steak',
    'bbq',
    'pudding',
    'hamburger',
    'pie',
    'cake',
    'sausage',
    'tacos',
    'kebab',
    'poutine',
    'seafood',
    'chips',
    'fries',
    'masala',
    'paella',
    'som tam',
    'chicken',
    'toast',
    'marzipan',
    'tofu',
    'ketchup',
    'hummus',
    'chili',
    'maple syrup',
    'parma ham',
    'fajitas',
    'champ',
    'lasagna',
    'poke',
    'chocolate',
    'croissant',
    'arepas',
    'bunny chow',
    'pierogi',
    'donuts',
    'rendang',
    'sushi',
    'ice cream',
    'duck',
    'curry',
    'beef',
    'goat',
    'lamb',
    'turkey',
    'pork',
    'fish',
    'crab',
    'bacon',
    'ham',
    'pepperoni',
    'salami',
    'ribs'
  ];
  const input = elements.searchInput.value;
  if (allowedQueries.includes(input)) {
    return input;
  } else {
    alert(`Please search one of these recipes:
--------------------------------------
${allowedQueries.join(', ')}
--------------------------------------`);
    return null;
  }
};

export const clearQuery = () => {
  elements.searchInput.value = '';
};

export const clearRecipes = () => {
  elements.recipeList.innerHTML = '';
  elements.paginationBtnParent.innerHTML = '';
};

const formatStr = (str, limit = 17) => {
  // format str so it's length <= limit, ends with '...' when necessary
  if (str.length > limit) {
    str = str.slice(0, limit - 3) + '...';
  }
  return str;
};

const renderRecipe = (recipe) => {
  const html = `
    <li>
      <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${formatStr(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>
  `;
  elements.recipeList.insertAdjacentHTML('beforeend', html);
};

const paginationBtnsHTML = (page, type) => `
  <button class="btn-inline results__btn--${type}"  data-goto="${type === 'prev' ? page - 1 : page + 1}">
    <span>Page ${type === 'prev' ? (page - 1).toString() : (page + 1).toString()}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
  `;

const renderPaginationBtns = (listTotal, page, perPage) => {
  const totalPages = Math.ceil(listTotal / perPage);
  let html;
  if (page === 1 && totalPages > 1) {
    html = paginationBtnsHTML(page, 'next');
  } else if (page === totalPages && totalPages > 1) {
    html = paginationBtnsHTML(page, 'prev');
  } else {
    html = paginationBtnsHTML(page, 'prev') + paginationBtnsHTML(page, 'next');
  }
  elements.paginationBtnParent.insertAdjacentHTML('beforeend', html);
};

export const renderRecipes = (recipes, page = 1, perPage = 10) => {
  if (recipes.length / perPage >= page - 1) {
    const start = (page - 1) * perPage;
    const end = page * perPage;
    recipes.slice(start, end).forEach((recipe) => renderRecipe(recipe));
    renderPaginationBtns(recipes.length, page, perPage);
  }
};
