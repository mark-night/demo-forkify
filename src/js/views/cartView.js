import { elements, selectors } from './base';

export const renderItem = item => {
  if (item.count !== undefined) {
    const itemInCart = document.querySelector(`li[data-id="${item.id}"]`);
    if (itemInCart) {
      // item in cart already, just update count
      const input = `li[data-id="${item.id}"] ${selectors.shoppingCartItemCount}`;
      document.querySelector(input).value = item.count.toString();
    } else {
      const html = `
        <li class="shopping__item" data-id="${item.id}">
          <div class="shopping__count">
              <input type="number" value="${item.count}" step="${
        item.count / 2
      }" 
              min="0" class="${selectors.shoppingCartItemCount.split('.')[1]}">
              <p>${item.unit}</p>
          </div>
          <p class="shopping__description">${item.ingredient}</p>
          <button class="shopping__delete btn-tiny">
              <svg>
                  <use href="img/icons.svg#icon-circle-with-cross"></use>
              </svg>
          </button>
        </li>
      `;
      elements.shoppingCart.insertAdjacentHTML('beforeend', html);
    }
  }
};

export const removeItem = id => {
  const item = document.querySelector(`li[data-id="${id}"]`);
  item.parentElement.removeChild(item);
};
