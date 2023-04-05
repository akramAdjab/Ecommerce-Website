import * as model from './model.js';

// import bodymovin from 'lottie-web';

import checkoutModel from './model/checkoutModel.js';
import productsModel from './model/productsModel.js';
import cartModel from './model/cartModel.js';

import headerView from './view/headerView.js';
// import videoControlView from './view/videoControlView.js';
import copyrightView from './view/copyrightView';
import categoriesView from './view/categoriesView';
import productsView from './view/productsView';
import productView from './view/productView';
import cartView from './view/cartView';
import checkoutView from './view/checkoutView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlCategories = async function () {
  try {
    // Category loading animation
    categoriesView.renderCategoryLoading();

    // Get categories data
    const data = await model.categories();

    // Send data to categories to render it
    categoriesView.renderMarkup(data);

    // Render current category button
    localStorage.getItem('category-name') &&
      categoriesView.highlightCategoryName(
        localStorage.getItem('category-name')
      );
  } catch (err) {
    console.log(err.message);
  }
};

const controlProducts = async function (categoryName = 'all') {
  try {
    // Product loading animation
    productsView.renderProductLoading('.section__trends', 5);
    productsView.renderProductLoading('.section__new', 5);
    productsView.renderProductLoading('.section__products', 10);

    // Get products data
    const data = await productsModel.products();

    // Check if there's category name stored in local storage
    if (localStorage.getItem('category-name')) {
      const categoryData = data.filter(
        product =>
          product.categories[0].slug === localStorage.getItem('category-name')
      );

      // Render products based on category name
      productsView.renderMarkup(categoryData);
    }

    // Check if there's no category name in local storage or if user clicks on btn
    if (
      !categoryName ||
      (categoryName === 'all' && !localStorage.getItem('category-name'))
    ) {
      // Render All the products
      productsView.renderMarkup(data);
    }

    // Check if user clicks on btn
    if (categoryName && categoryName !== 'all') {
      const categoryData = data.filter(
        product => product.categories[0].slug === categoryName
      );

      // Render products based on category name
      productsView.renderMarkup(categoryData);
    }

    return data;
  } catch (err) {
    console.log(err);
  }
};

const controlProductsPage = function (categoryName) {
  // Check if user clicks on product
  if (!categoryName) return;

  console.log(categoryName);

  // Store the product name in the local storage that user select
  localStorage.setItem('category-name', categoryName);

  // Go to product details page
  window.location.assign('products.html');
};

const controlPage = function (productName) {
  // Check if user clicks on product
  if (productName) {
    // Store the product name in the local storage that user select
    localStorage.setItem('product-name', productName);

    // Go to product details page
    window.location.assign('product.html');
  }
};

if (window.location.href.includes('product.html')) {
  (async function () {
    try {
      // Render product loading
      productView.renderProductLoading();
      productsView.renderProductLoading('.section__related-products', 5);

      // Get all products data
      const data = await productsModel.products();

      // Get the current produtc data
      const productData =
        window.location.hash.slice(1) === ''
          ? await productsModel.product(
              data.find(
                product => product.name === localStorage.getItem('product-name')
              ).id
            )
          : await productsModel.product(
              data.find(
                product =>
                  product.name ===
                  window.location.hash.slice(1).replaceAll('-', ' ')
              ).id
            );

      // Send data to productView to render it to user interface
      productView.renderMarkup(productData);

      // Render related products
      productsView.renderRelatedProducts(productData);

      // Change the URL
      window.history.pushState(
        null,
        '',
        `#${productData.name.replaceAll(' ', '-')}`
      );
    } catch (err) {
      console.log(err.message);
    }
  })();
}

const controlCartAdd = async function (productColor, productSize) {
  try {
    // Get all products and product data
    const productData = productsModel.productdata;

    // Add product to cart and render it to UI
    const options = {
      [productData.variant_groups[0].id]:
        productData.variant_groups[0].options.find(
          option => option.name === productColor
        ).id,
      [productData.variant_groups[1].id]:
        productData.variant_groups[1].options.find(
          option => option.name === productSize
        ).id,
    };

    // Get cart data and render it to the user interface
    cartView.updateCart(await cartModel.addToCart(productData.id, options));
  } catch (err) {
    console.log(err.message);
  }
};

const controlCartRetrieve = async function () {
  try {
    // Get cart products data
    const data = await cartModel.retrieveCart();

    // Render cart to UI
    cartView.updateCart(data);

    // return data;
  } catch (err) {
    console.log(err.message);
  }
};

const controlRemoveProductCart = async function (productName) {
  try {
    // Get cart data
    const data = cartModel.cartData;

    // Remove item from cart
    const newCartData = await cartModel.removeProductCart(
      data.line_items.find(product => product.name === productName).id
    );

    // Render new cart data to user interface
    cartView.updateCart(newCartData);
  } catch (err) {
    console.log(err);
  }
};

const controlUpdateCart = async function (productName, quantity) {
  try {
    // Get cart data
    const data = cartModel.cartData;

    await cartModel.updateCart(
      data.line_items.find(product => product.name === productName).id,
      quantity
    );

    // cartView.updateCart(cartData);
  } catch (err) {
    console.log(err.message);
  }
};

const controlGoToCheckout = function () {
  window.location.assign('checkout.html');
};

if (window.location.href.includes('checkout.html')) {
  (async function () {
    try {
      // Render product loading
      checkoutView.renderProductLoading();

      await cartModel.retrieveCart();

      // Send checkout data to checkout view
      checkoutView.renderProductOrder(
        await checkoutModel.generateCheckout(cartModel.cartId, {
          type: 'cart',
        })
      );

      // checkoutView.renderProductOrder(checkoutModel.data);

      // Send countries data to checkout view
      checkoutView.renderShippingCountries(
        await checkoutModel.shippingCountries()
      );

      // Send countries subdivision data to checkout view
      checkoutView.renderSubdivisions(
        await checkoutModel.countriesSubdivisions()
      );
    } catch (err) {
      console.log(err.message);
    }
  })();
}

const controlCaptureOrder = async function (
  customerObj,
  shippingObj,
  shippingPrice,
  billingObj
) {
  try {
    const data = await checkoutModel.captureOrder(
      customerObj,
      shippingObj,
      shippingPrice,
      billingObj
    );

    // Send data to render the order id
    checkoutView.renderOrderId(data);
  } catch (err) {
    console.log(err.message);
  }
};

const controlBackToHome = function () {
  window.location.assign('index.html');
};

const init = function () {
  controlCategories();
  controlProducts();
  controlCartRetrieve();

  headerView.stickyHeader();
  // videoControlView.renderVideo();
  copyrightView.renderCopyrightYear();
  categoriesView.handleCategoryName(controlProductsPage);

  categoriesView.renderHandlerBtns(controlProducts);
  productsView.getProductName(controlPage);
  productView.addToBagHandler(controlCartAdd);
  productView.handleCategoryName(controlProductsPage);

  cartView.renderCart();
  cartView.removeProduct(controlRemoveProductCart);
  cartView.updateQuantity(controlUpdateCart);
  cartView.goToCheckout(controlGoToCheckout);

  checkoutView.captureOrder(controlCaptureOrder);
  checkoutView.handleBackToHome(controlBackToHome);

  // controlAnimation();
};
init();
