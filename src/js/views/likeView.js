import { elements, selectors } from './base';
import { formatStr } from './searchView';

export const renderLike = like => {
  const html = `
    <li>
      <a class="likes__link" href="#${like.id}">
          <figure class="likes__fig">
              <img src="${like.img}" alt="${like.title}">
          </figure>
          <div class="likes__data">
              <h4 class="likes__name">${formatStr(like.title)}</h4>
              <p class="likes__author">${like.author}</p>
          </div>
      </a>
    </li>
  `;
  elements.likesList.insertAdjacentHTML('beforeend', html);
};

export const removeLike = id => {
  const like = document.querySelector(`${selectors.likeList} a[href="#${id}"]`)
    .parentElement;
  like.parentElement.removeChild(like);
};

export const toggleLikeIcon = isLiked => {
  const use = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document
    .querySelector(`${selectors.btnLike} use`)
    .setAttribute('href', `img/icons.svg#${use}`);
};

export const toggleLikesMenu = numLikes => {
  elements.likesListMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};
