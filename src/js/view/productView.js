import { mark } from 'regenerator-runtime';

class productView {
  parentEl = document.querySelector('.product-item');
  _data;

  renderMarkup(data) {
    if (!this.parentEl) return;
    this._data = data;

    // Render the product details
    this.parentEl.innerHTML = '';
    this.#generateMarkup(data);

    // Render Shipping details
    this.#shippingDetails();

    // Render image carrousel functionality
    this.#createImageSlide();

    // Render the selected options
    this.#optionsSelected();
  }

  #generateMarkup(data) {
    const markup = `
        <div class="product-item__img-box mb-md">
            ${data.assets
              .map(
                img =>
                  `<img src="${img.url}" alt="${data.name}" class="product-item__img" />`
              )
              .join('')}
            <div class="product-item__icons">
            <button class="product-item__icon left"><i class="ri-arrow-left-s-line product-item__icon--left"></i></button>
            <button class="product-item__icon right"><i class="ri-arrow-right-s-line product-item__icon--right"></i></button>
            </div>
        </div>

        <!-- Product details -->
        <div class="product-item__details product__details">
            <h4 class="heading-forty product-item__title mb-xsm">${
              data.name
            }</h4>
            <a href="#" class="nav__link product__category mb-sm"
            >&mdash; ${data.categories[0].name}</a
            >
            <p class="product__price mb-md">${
              data.price.formatted_with_code
            }</p>

            <!-- Product colors -->
            <div class="mb-md">
            <h4 class="heading-forty mb-sm">Select color</h4>
            <div class="product__config product__colors">
                ${data.variant_groups
                  .find(variant => variant.name === 'Color')
                  .options.map(
                    color =>
                      `<p class="product__option product__color">${color.name}</p>`
                  )
                  .join('')}
            </div>
            </div>

            <!-- Product size -->
            <div class="mb-md">
            <h4 class="heading-forty mb-sm">Select size</h4>
            <div class="product__config product__sizes mb-md">
                ${data.variant_groups
                  .find(variant => variant.name === 'Size')
                  .options.map(
                    size =>
                      `<p class="product__option product__size">${size.name}</p>`
                  )
                  .join('')}
            </div>
            </div>

            <!-- Product btn: ADD TO BAG -->
            <button class="btn btn--dark btn--big mb-xsm"
            >Add to bag</button>
            <p class="product__error textCenter hidden mb-md">Please select <span class="error-type"></span>.</p>

            <!-- Product description -->
            <div class="mb-xlg">
            <h3 class="heading-tertiary mb-sm">Product description</h3>
            <p class="product__desc">${data.description.slice(3, -4)}</p>
            </div>

            <!-- <div class="product__shipping product__shipping--active"> -->
            <div class="product__shipping"> 
            <h3 class="heading-tertiary product__shipping--title mb-sm">
                Shipping & returns
                <span><i class="ri-arrow-down-s-line"></i></span>
            </h3>
            <p class="product__shipping--details">
                Free standard shipping and free 60-day returns for Nike Members.
            </p>
            </div>
        </div>
    `;

    this.parentEl.insertAdjacentHTML('beforeend', markup);
  }

  renderProductLoading() {
    const markup = `
      <div class="product-item__img-box mb-md">
        <div class="loading--img-big loading--skeleton" /></div>
        <div class="loading--img-big loading--skeleton" /></div>
        <div class="loading--img-big loading--skeleton" /></div>
        <div class="loading--img-big loading--skeleton" /></div>
        <div class="loading--img-big loading--skeleton" /></div>
        <div class="loading--img-big loading--skeleton" /></div>
        <div class="loading--img-big loading--skeleton" /></div>
        <div class="loading--img-big loading--skeleton" /></div>
      </div>

      <!-- Product details -->
      <div class="product-item__details product__details">
          <div class="product-item__title loading--title loading--skeleton mb-xsm"></div>
          <div class="product__category loading--category loading--skeleton mb-sm"></div>
          <div class="product__price loading--price loading--skeleton mb-md"></div>

          <!-- Product colors -->
          <div class="mb-md">
          <h4 class="heading-forty mb-sm">Select color</h4>
          <div class="product__config product__colors">
            <p class="loading--option loading--skeleton"></p>
            <p class="loading--option loading--skeleton"></p>
            <p class="loading--option loading--skeleton"></p>
            <p class="loading--option loading--skeleton"></p>
          </div>
          </div>

          <!-- Product size -->
          <div class="mb-md">
          <h4 class="heading-forty mb-sm">Select size</h4>
          <div class="product__config product__sizes mb-md">
            <p class="loading--option loading--skeleton"></p>
            <p class="loading--option loading--skeleton"></p>
            <p class="loading--option loading--skeleton"></p>
            <p class="loading--option loading--skeleton"></p>
            <p class="loading--option loading--skeleton"></p>
            <p class="loading--option loading--skeleton"></p>
          </div>
          </div>

          <!-- Product btn: ADD TO BAG -->
          <button class="btn btn--dark btn--big mb-xsm"
          >Add to bag</button>
          <p class="product__error textCenter hidden mb-md">Please select <span class="error-type"></span>.</p>

          <!-- Product description -->
          <div class="mb-xlg">
          <h3 class="heading-tertiary mb-sm">Product description</h3>
            <div class="loading--description">
              <div class="loading--description-item loading--skeleton"></div>
              <div class="loading--description-item loading--skeleton"></div>
              <div class="loading--description-item loading--skeleton"></div>
              <div class="loading--description-item loading--skeleton"></div>
              <div class="loading--description-item loading--skeleton"></div>
              <div class="loading--description-item loading--skeleton"></div>
              <div class="loading--description-item loading--skeleton"></div>
            </div>
          </div>

          <!-- <div class="product__shipping product__shipping--active"> -->
          <div class="product__shipping"> 
          <h3 class="heading-tertiary product__shipping--title mb-sm">
              Shipping & returns
              <span><i class="ri-arrow-down-s-line"></i></span>
          </h3>
          <p class="product__shipping--details">
              Free standard shipping and free 60-day returns for Nike Members.
          </p>
          </div>
      </div>
    `;

    this.parentEl.insertAdjacentHTML('beforeend', markup);
  }

  #createImageSlide() {
    // Select the media-query at 37.5em
    const mediaQuery = window.matchMedia('(max-width: 37.5em)');

    if (!mediaQuery.matches) return;

    // Check if width matches the mediaQuery variable and render image slide
    this.#slideFunctionality();
  }

  #slideFunctionality() {
    const imgs = [...this.parentEl.querySelectorAll('.product-item__img')];
    const btnLeft = this.parentEl.querySelector('.left');
    const btnRight = this.parentEl.querySelector('.right');

    let curSlide = 0;
    const maxSlide = imgs.length;

    imgs.forEach((img, i) => {
      img.style.transform = `translateX(${100 * i}%)`;
    });

    // Functions
    const gotToSlide = function (slide) {
      imgs.forEach((img, i) => {
        img.style.transform = `translateX(${100 * (i - slide)}%)`;
      });
    };

    const nextSlide = function () {
      if (curSlide === maxSlide - 1) curSlide = 0;
      else curSlide++;

      gotToSlide(curSlide);
    };

    const prevSlide = function () {
      if (curSlide === 0) curSlide = maxSlide - 1;
      else curSlide--;

      gotToSlide(curSlide);
    };

    const init = function () {
      gotToSlide(0);
    };
    init();

    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });
  }

  #shippingDetails() {
    this.parentEl.addEventListener('click', function (e) {
      if (!e.target.closest('.product__shipping')) return;

      e.target
        .closest('.product__shipping')
        .classList.toggle('product__shipping--active');
    });
  }

  #optionsSelected() {
    this.parentEl.addEventListener('click', function (e) {
      if (!e.target.closest('.product__option')) {
        // Remove the selected class from all the elements
        [...this.querySelectorAll(`.product__option`)].forEach(el =>
          el.classList.remove('product__selected')
        );
      }

      if (!e.target.classList.contains('product__selected')) {
        [
          ...this.querySelectorAll(
            `.product__${
              e.target.classList.contains('product__color') ? 'color' : 'size'
            }`
          ),
        ].forEach(el => el.classList.remove('product__selected'));
      }

      if (e.target.closest('.product__option')) {
        // Add the selected class to selected element
        e.target.classList.add('product__selected');
      }
    });
  }

  handleCategoryName(handler) {
    if (!this.parentEl) return;

    this.parentEl.addEventListener('click', function (e) {
      if (!e.target.closest('.product__category')) return;

      // Send category name
      handler(
        e.target
          .closest('.product__category')
          .textContent.toLowerCase()
          .slice(2)
      );
    });
  }

  addToBagHandler(handler) {
    if (!this.parentEl) return;

    this.parentEl.addEventListener('click', function (e) {
      if (!e.target.closest('.btn')) return;
      const errorEl = this.querySelector('.error-type');

      const colorOptions = [...this.querySelectorAll('.product__color')];
      const sizeOptions = [...this.querySelectorAll('.product__size')];

      // Check functionality
      errorEl.parentElement.classList.remove('hidden');

      // Check if color or size NOT selected
      if (
        !colorOptions.some(el => el.classList.contains('product__selected')) ||
        !sizeOptions.some(el => el.classList.contains('product__selected'))
      ) {
        errorEl.textContent = `${
          !colorOptions.some(el => el.classList.contains('product__selected'))
            ? 'color'
            : 'size'
        }`;
      }

      // Check if both color and size NOT selected
      if (
        !colorOptions.some(el => el.classList.contains('product__selected')) &&
        !sizeOptions.some(el => el.classList.contains('product__selected'))
      ) {
        errorEl.textContent = 'color and size';
      }

      // Check if both color and size selected
      if (
        colorOptions.some(el => el.classList.contains('product__selected')) &&
        sizeOptions.some(el => el.classList.contains('product__selected')) &&
        !errorEl.parentElement.classList.contains('hidden')
      ) {
        errorEl.parentElement.classList.add('hidden');

        // Send data to controller
        handler(
          colorOptions.find(el => el.classList.contains('product__selected'))
            .textContent,
          sizeOptions.find(el => el.classList.contains('product__selected'))
            .textContent
        );
      }
    });
  }
}

export default new productView();
