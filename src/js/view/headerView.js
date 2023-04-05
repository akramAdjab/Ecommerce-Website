class HeaderView {
  parentEl = document.querySelector('.hero');

  stickyHeader() {
    if (!this.parentEl) return;

    const headerEl = this.parentEl.querySelector('.header');
    const headerHeight = headerEl.getBoundingClientRect().height;

    const sticky = function (entries) {
      const [entry] = entries;

      if (!entry.isIntersecting) {
        headerEl.classList.add('header-fixed');
        headerEl.classList.add('header-white');
      } else {
        headerEl.classList.remove('header-fixed');
        headerEl.classList.remove('header-white');
      }
    };

    const headerObs = new IntersectionObserver(sticky, {
      root: null,
      threshold: 0,
      rootMargin: `-${headerHeight}px`,
    });

    headerObs.observe(this.parentEl);
  }
}

export default new HeaderView();
