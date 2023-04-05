import { commerce } from '../model';

class Cart {
  cartId;
  cartData;

  async addToCart(productId, options) {
    try {
      // Add to cart
      const res = await commerce.cart.add(productId, 1, options);

      // Store cart id and data
      this.cartId = res.id;
      this.cartData = res;

      return res;
    } catch (err) {
      throw new Error(
        'Something went wrong. Please reload the page and try again!'
      );
    }
  }

  async retrieveCart() {
    try {
      // Get cart data
      const res = await commerce.cart.retrieve();

      // Store cart id and data
      this.cartId = res.id;
      this.cartData = res;

      // Return cart data
      return res;
    } catch (err) {
      throw new Error(
        'Something went wrong. Please reload the page and try again!'
      );
    }
  }

  async removeProductCart(productId) {
    try {
      return await commerce.cart.remove(productId);
    } catch (err) {
      throw new Error(
        'Something went wrong. Please reload the page and try again!'
      );
    }
  }

  async updateCart(productId, quantity) {
    try {
      return await commerce.cart.update(productId, { quantity: quantity });
    } catch (err) {
      throw new Error(
        'Something went wrong. Please reload the page and try again!'
      );
    }
  }
}

export default new Cart();
