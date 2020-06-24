import axios from 'axios';

export default class Search {
  constructor() {}
  async getResult(query) {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${query}`
      );
      this.recipes = res.data.recipes;
      this.save();
    } catch (err) {
      alert(err);
    }
  }

  save() {
    sessionStorage.setItem('recipes', JSON.stringify(this.recipes));
  }

  restore() {
    const recipes = JSON.parse(sessionStorage.getItem('recipes'));
    if (recipes) this.recipes = recipes;
  }
}
