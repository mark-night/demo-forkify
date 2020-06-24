import { elements, selectors } from './base';

export const renderLike = like => {
  const html = `
    <li>
      <a class="likes__link" href="#${like.id}">
          <figure class="likes__fig">
              <img src="${like.img}" alt="${like.title}">
          </figure>
          <div class="likes__data">
              <h4 class="likes__name">${like.title}</h4>
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
