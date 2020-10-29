import uniqid from 'uniqid';

export default class Cart {
  constructor() {
    this.items = [];
  }

  addItem(ingredient) {
    const repeatItem = this.items.find(
      item => item.ingredient === ingredient.ingredient
    );
    if (repeatItem) {
      // item in cart already, just update count
      let count;
      switch (true) {
        case Boolean(repeatItem.count && ingredient.count):
          count = repeatItem.count + ingredient.count;
          break;
        case Boolean(repeatItem.count && !ingredient.count):
          count = repeatItem.count;
          break;
        case Boolean(!repeatItem.count && ingredient.count):
          count = ingredient.count;
          break;
      }
      this.updateCount(repeatItem.id, count);
      return repeatItem;
    } else {
      // item is not in the cart yet
      const newItem = {
        id: uniqid(),
        count: ingredient.count,
        unit: ingredient.unit,
        ingredient: ingredient.ingredient
      };
      this.items.push(newItem);
      this.save();
      return newItem;
    }
  }

  deleteItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    this.items.splice(index, 1);
    this.save();
  }

  updateCount(id, newCount) {
    this.items.find(item => item.id === id).count = newCount;
    this.save();
  }

  save() {
    sessionStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  restore() {
    const items = JSON.parse(sessionStorage.getItem('cartItems'));
    if (items) this.items = items;
  }
}
