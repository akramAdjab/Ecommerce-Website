import { mark } from 'regenerator-runtime';

class formView {
  parentEl = document.querySelector('.checkout');

  renderProductOrder(data) {
    if (!this.parentEl) return;

    // Render ordered product
    this.#generateMarkup(data);

    // Render prices
    this.#renderPrices(data);
    this.#renderShippingPrice(data);
  }

  #generateMarkup(data) {
    const markup = `${data.line_items
      .map(p => {
        return `
        <div class="checkout__product">
          <img
            src="${p.image.url}"
            alt="${p.name}"
            class="checkout__product--img"
          />

          <div class="checkout__details">
            <div>
              <h4 class="heading-forty">${p.name}</h4>
              <p class="product__price">${p.price.formatted_with_code}</p>
            </div>
            ${p.selected_options
              .map(item => {
                return `
                <p class="checkout__details--info">${item.group_name}: ${item.option_name}</p>
              `;
              })
              .join('')}
            <p class="checkout__details--info">Quantity: ${p.quantity}</p>
          </div>
        </div>
      `;
      })
      .join('')}
    `;

    this.parentEl.querySelector('.checkout__product-container').innerHTML = '';

    this.parentEl
      .querySelector('.checkout__product-container')
      .insertAdjacentHTML('afterbegin', markup);
  }

  renderProductLoading() {
    const markupProduct = `
      <div class="checkout__product">
        <div class="checkout__product--img loading--img-small loading--skeleton"></div>

        <div class="loading__checkout--details">        
            <div class="loading--title loading--skeleton"></div>
            <div class="loading--price loading--skeleton"></div>
            <div class="loading--price loading--skeleton"></div>
            <div class="loading--price loading--skeleton"></div>
        </div>
      </div>
    `;
    // Render the product markup
    this.parentEl
      .querySelector('.checkout__product-container')
      .insertAdjacentHTML('beforeend', markupProduct);

    // Render the prices
    this.parentEl
      .querySelector('.subtotal-price')
      .classList.add('loading--title', 'loading--skeleton');
    this.parentEl
      .querySelector('.total-price')
      .classList.add('loading--title', 'loading--skeleton');
  }

  #renderPrices(data) {
    // Remove the loading classes
    this.parentEl
      .querySelector('.subtotal-price')
      .classList.remove('loading--title', 'loading--skeleton');
    this.parentEl
      .querySelector('.total-price')
      .classList.remove('loading--title', 'loading--skeleton');

    const subtotal = data.subtotal.formatted_with_code;
    const total = data.subtotal.formatted_with_code;

    this.parentEl.querySelector('.subtotal-price').textContent = subtotal;
    this.parentEl.querySelector('.total-price').textContent = total;
  }

  renderShippingCountries(data) {
    for (const key of Object.keys(data.countries)) {
      this.parentEl
        .querySelector('.countries')
        .insertAdjacentHTML(
          'beforeend',
          `<option value="${key}" class="countries__option">${key}</option>`
        );
    }
  }

  renderSubdivisions(data) {
    this.parentEl.addEventListener('change', function (e) {
      if (
        !e.target.closest('.countries') ||
        !e.target.closest('.countries').value
      )
        return;

      // Get subdivisions of the selected country
      const countrySub = data.find(
        sub => sub.country === e.target.closest('.countries').value
      );

      // Clear options
      this.querySelector(
        '.cities'
      ).innerHTML = `<option value="">Please select a city</option>`;

      // Render subdivions based on the selected country
      for (const [key, option] of Object.entries(
        countrySub.subdivision.subdivisions
      )) {
        this.querySelector('.cities').insertAdjacentHTML(
          'beforeend',
          `<option value="${key}" class="cities__option">${option}</option>`
        );
      }
    });
  }

  #renderShippingPrice(data) {
    this.parentEl.addEventListener('change', function (e) {
      if (!e.target.closest('.countries')) return;

      // If NO country selected
      if (!e.target.closest('.countries').value) {
        this.querySelector('.shipping-price').innerHTML = 'No country selected';
        this.querySelector('.total-price').innerHTML =
          data.total.formatted_with_code;

        return;
      }

      // Get shipping country information
      const shippingCountry = data.shipping_methods.find(
        option => option.description === e.target.closest('.countries').value
      );

      // Render shipping cost
      this.querySelector('.shipping-price').innerHTML =
        shippingCountry.price.formatted_with_code;

      // Render total of product price and shipping
      this.querySelector('.total-price').innerHTML = `${new Intl.NumberFormat(
        'en-US',
        { style: 'currency', currency: 'DZD' }
      )
        .format(shippingCountry.price.raw + data.subtotal.raw)
        .replace('DZD', '')
        .trim()} DZD`;
    });
  }

  #formInvalid() {
    if (!this.parentEl) return;

    // Event Hendler for the button
    this.parentEl.addEventListener('click', function (e) {
      if (!e.target.closest('.btn--order')) return;

      const inputsEl = [...this.querySelectorAll('.form__input')];
      inputsEl.forEach(input => {
        if (input.value === '') {
          input.parentElement.classList.add('form__invalid');
          this.querySelector('.product__error').classList.remove('hidden');
        } else {
          input.parentElement.classList.remove('form__invalid');
          this.querySelector('.product__error').classList.add('hidden');
        }
      });
    });
  }

  captureOrder(handler) {
    if (!this.parentEl) return;

    this.#formInvalid();

    this.parentEl.addEventListener('click', function (e) {
      if (!e.target.closest('.btn--order')) return;

      const inputsEl = [...this.querySelectorAll('.form__input')];
      if (inputsEl.some(input => input.value === '')) return;

      handler(
        {
          firstname: this.querySelector('#first-name').value,
          lastname: this.querySelector('#last-name').value,
          email: this.querySelector('#email').value,
        },
        {
          name: `${this.querySelector('#first-name').value} ${
            this.querySelector('#last-name').value
          }`,
          street: this.querySelector('#address').value,
          town_city: this.querySelector('#province').value,
          county_state: this.querySelector('#city').value,
          country: this.querySelector('#country').value,
          postal_zip_code: this.querySelector('#post-code').value,
        },
        this.querySelector('.shipping-price').textContent,
        {
          name: `${this.querySelector('#first-name').value} ${
            this.querySelector('#last-name').value
          }`,
          street: this.querySelector('#address').value,
          town_city: this.querySelector('#province').value,
          county_state: this.querySelector('#city').value,
          country: this.querySelector('#country').value,
          postal_zip_code: this.querySelector('#post-code').value,
        }
      );

      // Remove hidden class for overlay element
      document.body
        .querySelector('.overlay')
        .classList.remove('overlay__hidden');

      // Render order animation
      document.body
        .querySelector('.loading-box')
        .classList.remove('preloader__hidden');
    });
  }

  renderOrderId(data) {
    if (!this.parentEl) return;

    // Remove order animation
    document.querySelector('.loading-box').classList.add('preloader__hidden');

    // Render confirmation component
    document.body.querySelector('.success').classList.remove('success__hidden');

    // Render order ID
    document.body.querySelector('.success__order-id').textContent = data.id;
  }

  handleBackToHome(handler) {
    if (!this.parentEl) return;

    document.body
      .querySelector('.success__btn')
      .addEventListener('click', function () {
        handler();
      });
  }
}

// commerce.checkout.capture('chkt_959gvxcZ6lnJ7', {
//   line_items: {
//     item_7RyWOwmK5nEa2V: {
//       quantity: 1,
//       selected_options: {
//         vgrp_p6dP5g0M4ln7kA: 'optn_DeN1ql93doz3ym'
//       }
//     }
//   },
//   customer: {
//     firstname: 'John',
//     lastname: 'Doe',
//     email: 'john.doe@example.com'
//   },
//   shipping: {
//     name: 'John Doe',
//     street: '123 Fake St',
//     town_city: 'San Francisco',
//     county_state: 'US-CA',
//     postal_zip_code: '94103',
//     country: 'US'
//   },
//   fulfillment: {
//     shipping_method: 'ship_7RyWOwmK5nEa2V'
//   },
//   billing: {
//     name: 'John Doe',
//     street: '234 Fake St',
//     town_city: 'San Francisco',
//     county_state: 'US-CA',
//     postal_zip_code: '94103',
//     country: 'US'
//   },
//   payment: {
//     gateway: 'stripe',
//     card: {
//       token: 'irh98298g49'
//     }
//   },
//   pay_what_you_want: '149.99'
// }).then((response) => console.log(response));

export default new formView();
