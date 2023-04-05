class copyrightView {
  parentEl = document.querySelector('.footer__copyright-year');

  renderCopyrightYear() {
    const now = new Date();

    this.parentEl.textContent = now.getFullYear();
  }
}

export default new copyrightView();
