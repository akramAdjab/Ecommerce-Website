class productsView {
  parentEl = document.querySelectorAll('.products');

  renderMarkup(data) {
    this.parentEl.forEach(el => {
      //   console.log(el.parentElement.classList.contains('section__trends'));
      if (el.parentElement.classList.contains('section__trends')) {
        // Clear the interface
        el.innerHTML = '';

        data.slice(-5).forEach(data => {
          this.#generateMarkup(el, data);
        });
      }

      if (el.parentElement.classList.contains('section__new')) {
        // Clear the interface
        el.innerHTML = '';

        data.slice(0, 5).forEach(data => {
          this.#generateMarkup(el, data);
        });
      }

      if (el.parentElement.classList.contains('section__products')) {
        // Clear the interface
        el.innerHTML = '';

        data.forEach(data => {
          this.#generateMarkup(el, data);
        });
      }
    });
  }

  renderRelatedProducts(data) {
    this.parentEl.forEach(el => {
      if (el.parentElement.classList.contains('section__related-products')) {
        // Clear the interface
        el.innerHTML = '';

        data.related_products.length <= 4
          ? data.related_products.forEach(data =>
              this.#generateMarkup(el, data)
            )
          : data.related_products
              .slice(0, 5)
              .forEach(data => this.#generateMarkup(el, data));
      }
    });
  }

  renderProductLoading(parentEl, num) {
    if (!document.querySelector(parentEl)) return;

    for (let i = 1; i <= num; i++) {
      const markup = `
        <!-- Product ${i} -->
          <div class="products__item product loading">
            <div
              class="product__img-box loading--img loading--skeleton mb-md"
            ></div>
            <div class="product__details">
              <div
                class="product__title loading--title loading--skeleton mb-sm"
              ></div>
              <div
                class="product__price loading--price loading--skeleton"
              ></div>
            </div>
          </div>
      `;

      document
        .querySelector(parentEl)
        .querySelector('.products')
        .insertAdjacentHTML('beforeend', markup);
    }
  }

  #generateMarkup(el, data) {
    const markup = `
        <article class="products__item product">
            <div class="product__img-box mb-md">
            <img
                src="${data.image.url}"
                alt="${data.name}"
                class="product__img"
            />
            </div>
            <div class="product__details">
            <h4 class="heading-forty product__title mb-sm">${data.name}</h4>
            <p class="product__price">${data.price.formatted_with_code}</p>
            </div>
        </article>
    `;

    el.insertAdjacentHTML('beforeend', markup);
  }

  getProductName(handler) {
    if (!this.parentEl) return;

    [...this.parentEl].forEach(el => {
      el.addEventListener('click', function (e) {
        const targetProduct = e.target.closest('.product');

        // return product name
        handler(targetProduct?.querySelector('.product__title').textContent);
      });
    });

    // this.parentEl.addEventListener('click', function (e) {
    // });
  }
}

export default new productsView();
