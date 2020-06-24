export default class Like {
  constructor() {
    this.likes = [];
  }

  addLike(recipe) {
    const like = {
      id: recipe.id,
      author: recipe.author,
      title: recipe.title,
      img: recipe.img
    };
    this.likes.push(like);
    return like;
  }

  removeLike(id) {
    const index = this.likes.findIndex(like => like.id === id);
    this.likes.splice(index, 1);
  }

  isLiked(id) {
    return this.likes.some(like => like.id === id);
  }
}
