import { commerce } from '../model';

class Checkout {
  checkoutId;
  data;
  countries = [];

  async generateCheckout(cartId, options) {
    try {
      // Getting checkout data
      const res = await commerce.checkout.generateToken(cartId, options);

      // Store checkout id and data
      this.checkoutId = res.id;
      this.data = res;

      // Return checkout data
      return res;
    } catch (err) {
      console.log(err);
      // throw new Error('Something went wrong. Please reload the page and try again!');
    }
  }

  async shippingCountries() {
    try {
      // Getting the shipping countries data
      const res = await commerce.services.localeListShippingCountries(
        this.checkoutId
      );

      // Store shipping countries
      for (const country of Object.keys(res.countries)) {
        this.countries.push(country);
      }

      // Return shipping countries
      return res;
    } catch (err) {
      throw new Error(
        'Something went wrong. Please reload the page and try again!'
      );
    }
  }

  async countriesSubdivisions() {
    try {
      const subdivisions = [];

      // Loop over countries array and get subdivision for each country
      for (const country of this.countries) {
        const resSubdivision =
          await commerce.services.localeListShippingSubdivisions(
            this.checkoutId,
            country
          );

        // Store country subdivision
        subdivisions.push({
          country,
          subdivision: resSubdivision,
        });
      }

      // Return countries subdivisions
      return subdivisions;
    } catch (err) {
      throw new Error(
        'Something went wrong. Please reload the page and try again!'
      );
    }
  }

  async captureOrder(customerObj, shippingObj, shippingPrice, billingObj) {
    try {
      const productObj = this.data.line_items.reduce((obj, lineItem) => {
        const variantGroups = lineItem.selected_options.reduce(
          (obj, option) => {
            obj[option.group_id] = option.option_id;
            return obj;
          },
          {}
        );
        obj[lineItem.id] = {
          quantity: lineItem.quantity,
          selected_options: variantGroups,
        };
        return obj;
      }, {});

      const shippingMethod = this.data.shipping_methods.find(
        method => method.price.formatted_with_code === shippingPrice
      );

      const newOrder = {
        line_items: productObj,
        customer: customerObj,
        shipping: shippingObj,
        fulfillment: {
          shipping_method: shippingMethod.id,
        },
        billing: billingObj,
        payment: {
          gateway: 'test_gateway',
          card: {
            number: '4242424242424242',
            expiry_month: '02',
            expiry_year: '24',
            cvc: '123',
            postal_zip_code: '94107',
          },
        },
      };
      console.log(newOrder);

      const res = await commerce.checkout.capture(this.checkoutId, newOrder);

      return res;
    } catch (err) {
      console.log(err);
      // throw new Error(
      //   'Something went wrong. Please reload the page and try again!'
      // );
    }
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

export default new Checkout();
