import { API_URL, PUBLIC_API_KEY, SECRET_API_KEY } from './config';
import { AJAX } from './helpers';

import Commerce from '@chec/commerce.js';
export const commerce = new Commerce(PUBLIC_API_KEY);

export const categories = async function () {
  try {
    const res = await commerce.categories.list();
    return res.data;
  } catch {
    throw new Error(
      'Something went wrong. Please reload the page and try again!'
    );
  }
};
