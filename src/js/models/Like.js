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
    this.save();
    return like;
  }

  removeLike(id) {
    const index = this.likes.findIndex(like => like.id === id);
    this.likes.splice(index, 1);
    this.save();
  }

  isLiked(id) {
    return this.likes.some(like => like.id === id);
  }

  numLikes() {
    return this.likes.length;
  }

  save() {
    sessionStorage.setItem('likes', JSON.stringify(this.likes));
  }

  restore() {
    const likes = JSON.parse(sessionStorage.getItem('likes'));
    if (likes) this.likes = likes;
  }
}
