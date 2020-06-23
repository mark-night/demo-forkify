import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResult() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
      this.recipes = res.data.recipes;
      this.recipes.page = 1;
    } catch (err) {
      alert(err);
    }
  }
}
