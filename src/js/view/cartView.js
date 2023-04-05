class cartView {
  // parentEl = document.querySelector('.cart');
  btnCartOpen = document.querySelector('.cart__btn--open');

  renderCart(data) {
    if (!this.btnCartOpen) return;

    // Render cart
    this.#generateOverlayMarkup();
    this.#generateCartMarkup(data);

    // Open close cart functionality
    this.#openCloseCart();
  }

  #generateCartMarkup(data) {
    const markup = `
        <aside class="cart cart__hidden">
            <!-- Cart title -->
            <div class="cart__title">
                <h3 class="heading-tertiary">Cart</h3>
                <button class="cart__icon cart__btn--close">
                    <i class="ri-close-line"></i>
                </button>
            </div>

           <!-- Cart product -->
           <div class="cart__product-container">
           ${!data ? `<p>Your cart is empty</p>` : this.updateCart(data)}
            </div>

            <!-- Cart Btns -->
            <div class="cart__btns btns">
                <button class="btn btn--continue-shopping">Continue shopping</button>
                <button class="btn btn--dark btn--checkout">Checkout</button>
            </div>
        </aside>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
  }

  updateCart(data) {
    if (!data) return;

    document.body.querySelector('.cart__product-container').innerHTML = `${
      data.line_items.length === 0
        ? `<p>Your cart is empty</p>`
        : data.line_items
            .map(
              product =>
                `<div class="cart__product">
           <img
             src="${product.image.url}"
             alt="${product.name}"
             class="cart__img"
           />
           <div class="cart__details">
             <div>
               <h4 class="heading-forty title">${product.name}</h4>
               <p class="cart__price">${product.price.formatted_with_code}</p>
             </div>
             <div>
               <div class="cart__quantity">
                 <button class="cart__icon subtract"><i class="ri-subtract-line"></i></button>
                 <p class="cart__quantity-number quantity">${product.quantity}</p>
                 <button class="cart__icon add"><i class="ri-add-line"></i></button>
               </div>
               <button class="cart__remove">remove</button>
             </div>
           </div>
         </div>`
            )
            .join('')
    }`;

    this.#updateCartNumber(data);
  }

  #updateCartNumber(data) {
    document.body.querySelector('.cart__item').textContent =
      data.line_items.length;
  }

  #generateOverlayMarkup() {
    const markup = `
        <div class="overlay overlay__hidden"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
  }

  #openCloseCart() {
    document.body.addEventListener('click', function (e) {
      const overlayEl = this.querySelector('.overlay');
      const cartEl = this.querySelector('.cart');

      // Cart open
      if (e.target.closest('.cart__btn--open')) {
        overlayEl.classList.remove('overlay__hidden');
        cartEl.classList.remove('cart__hidden');
      }
      // Cart close
      else if (
        e.target.closest('.cart__btn--close') ||
        e.target.closest('.overlay') ||
        e.target.closest('.btn--continue-shopping')
      ) {
        overlayEl.classList.add('overlay__hidden');
        cartEl.classList.add('cart__hidden');
      } else return;
    });
  }

  removeProduct(handler) {
    document.body.addEventListener('click', function (e) {
      if (!e.target.closest('.cart__remove')) return;

      handler(
        e.target.parentElement.parentElement.querySelector('.title').textContent
      );
    });
  }

  updateQuantity(handler) {
    document.body.addEventListener('click', function (e) {
      if (!e.target.closest('.cart__icon')) return;

      const quantityEl = e.target
        .closest('.cart__icon')
        .parentElement.querySelector('.quantity');

      if (!quantityEl) return;

      if (e.target.closest('.subtract')) {
        // If quantity is 1 return immediately and NOT update the cart
        if (+quantityEl.textContent === 1) return;

        // If NOT decrease the quantity then update the cart
        +quantityEl.textContent > 1 && +quantityEl.textContent--;
        quantityEl.textContent = +quantityEl.textContent;
      }
      if (e.target.closest('.add')) {
        +quantityEl.textContent++;
        quantityEl.textContent = +quantityEl.textContent;
      }

      handler(
        e.target.closest('.cart__details').querySelector('.title').textContent,
        +quantityEl.textContent
      );
    });
  }

  goToCheckout(handler) {
    document.body.addEventListener('click', function (e) {
      if (
        !e.target.closest('.btn--checkout') ||
        !this.querySelector('.cart__product')
      )
        return;

      handler();
    });
  }
}

export default new cartView();
