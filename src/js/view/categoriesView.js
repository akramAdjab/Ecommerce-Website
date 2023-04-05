class categoriesView {
  parentEl = document.querySelector('.categories');
  parentBtnsEl = document.querySelector('.categories__btns');

  renderMarkup(data) {
    if (!this.parentEl && !this.parentBtnsEl) return;

    if (this.parentEl) this.parentEl.innerHTML = '';

    data.forEach(data => {
      // Render categories in homepage
      this.parentEl && this.#generateMarkup(data);

      // Render categories bnts in products page
      this.parentBtnsEl && this.#generateBtnsMarkup(data);
    });
  }

  #generateMarkup(data) {
    const markup = `
        <div class="category">
            <img
            src="${data.assets[0].url}"
            alt="${data.name}"
            class="category__img"
            />
            <h3 class="heading-tertiary category__title">${data.name}</h3>
        </div>
    `;

    this.parentEl.insertAdjacentHTML('beforeend', markup);
  }

  #generateBtnsMarkup(data) {
    const markup = `
      <button class="btn btn--small">${data.name}</button>
    `;
    this.parentBtnsEl.insertAdjacentHTML('beforeend', markup);
  }

  renderCategoryLoading() {
    if (!this.parentEl) return;

    for (let i = 1; i <= 5; i++) {
      const markup = `
        <!-- Category i -->
        <div class="products__item product loading">
          <div
            class="product__img-box loading--img loading--skeleton mb-md"
          ></div>
        </div>
      `;

      this.parentEl.insertAdjacentHTML('beforeend', markup);
    }
  }

  handleCategoryName(handler) {
    if (!this.parentEl) return;

    this.parentEl.addEventListener('click', function (e) {
      // Send category name
      handler(
        e.target
          .closest('.category')
          .querySelector('.category__title')
          .textContent.toLowerCase()
      );
    });
  }

  highlightCategoryName(categoryName) {
    if (!this.parentBtnsEl) return;

    this.parentBtnsEl.querySelectorAll('.btn').forEach(btn => {
      // Remove active state
      btn.classList.remove('btn--active');

      // Add active state to the current category name
      btn.textContent ===
        categoryName.replace(categoryName[0], categoryName[0].toUpperCase()) &&
        categoryName.replace(categoryName[0], categoryName[0].toUpperCase()) &&
        btn.classList.add('btn--active');
    });

    localStorage.removeItem('category-name');
  }

  renderHandlerBtns(handler) {
    if (!this.parentBtnsEl) return;

    // Event handler for btns
    this.parentBtnsEl.addEventListener('click', function (e) {
      const targetBtn = e.target.closest('.btn');
      if (!targetBtn && targetBtn.classList.contains('btn--active')) return;

      if (!targetBtn.classList.contains('btn--active')) {
        // Removing the active state from the previous btn
        [...this.children]
          .find(btn => btn.classList.contains('btn--active'))
          .classList.remove('btn--active');

        // Add the active state to the target state
        targetBtn.classList.add('btn--active');
      }

      // Return the current category name
      handler(targetBtn.textContent.toLowerCase());
    });
  }
}

export default new categoriesView();
