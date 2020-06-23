import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios.get(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (err) {
      alert(err);
    }
  }

  calcTime() {
    // made up cook time, just to make the app complete
    // assuming 15 min will be required for every 3 ingredients
    this.time = Math.ceil(this.ingredients.length / 3) * 15;
  }

  calcServings() {
    // again, just arbitrary faked number
    this.servings = 3;
  }

  updateServings(type) {
    let newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    if (newServings >= 1) {
      this.ingredients.forEach(ig => {
        if (ig.count) {
          // Just to demonstrate the idea
          ig.count *= newServings / this.servings;
        }
      });
      this.servings = newServings;
    }
  }

  parseIngredients() {
    const unit = {
      tablespoons: 'tbsp',
      tablespoon: 'tbsp',
      ounces: 'oz',
      ounce: 'oz',
      teaspoons: 'tsp',
      teaspoon: 'tsp',
      cups: 'cup',
      cup: 'cup',
      pounds: 'lb',
      pound: 'lb',
      cans: 'can',
      can: 'can',
      slices: 'slice',
      slice: 'slice',
      bunches: 'bunch',
      bunch: 'bunch',
      kg: 'kg',
      g: 'g'
    };
    this.ingredients = this.ingredients.map(ingredient => {
      ingredient = ingredient.toLowerCase();
      // remove parentheses (keep blank after parentheses if there are any)
      ingredient = ingredient.replace(/ *\([^)]+\)/g, '');
      // format unit
      for (const key in unit) {
        ingredient = ingredient.replace(
          new RegExp(` +${key} +`, 'g'),
          ` ${unit[key]} `
        );
      }
      // parse ingredients into count, unit and ingredient itself
      const matchCount = '(?<count>^\\d+[\\d -/]*)?';
      const matchUnit = `((?<unit>${Object.values(unit).join('|')}) )?`;
      const matchIngredient = '(?<ingredient>.*)';
      // ? ? * => always matches, so there's no need to check if it was matched
      const matches = ingredient.match(
        new RegExp(matchCount + matchUnit + matchIngredient)
      );
      ingredient = {
        count:
          matches.groups.count === undefined
            ? undefined
            : eval(matches.groups.count.trim().replace(/( *- *)| {1,}/g, '+')),
        unit: matches.groups.unit === undefined ? '' : matches.groups.unit,
        ingredient: matches.groups.ingredient.trim()
      };
      return ingredient;
    });
  }
}
