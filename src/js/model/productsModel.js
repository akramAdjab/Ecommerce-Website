import { commerce } from '../model';

class Products {
  productsData;
  productdata;

  async products() {
    try {
      // Get products data
      const res = await commerce.products.list();

      // Store products data
      this.productsData = res.data;

      // Return products data
      return this.productsData;
    } catch (err) {
      throw new Error(
        'Something went wrong. Please reload the page and try again!'
      );
    }
  }

  async product(productId) {
    try {
      // Get product data based on ID
      const res = await commerce.products.retrieve(productId);

      // Store product data
      this.productdata = res;

      // Return product data
      return this.productdata;
    } catch (err) {
      throw new Error(
        'Something went wrong. Please reload the page and try again!'
      );
    }
  }
}

export default new Products();
