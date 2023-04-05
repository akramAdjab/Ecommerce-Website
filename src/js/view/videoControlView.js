class VideoControlView {
  imgEl = document.querySelector('.img');
  videoEl = document.querySelector('.video');
  // btnEl = document.querySelector('.btn__playPause');
  // btnAnimation = document.querySelector('.btn--animation');

  renderVideo() {
    document.querySelector('.video').addEventListener('load', function () {
      console.log('LOADED');

      // Add the hidden class to img
      document.querySelector('.img').classList.add('hidden-display');

      // Remove the hidden class for the video and btns
      document.querySelector('.video').classList.remove('hidden-display');
    });

    // this.btnEl.addEventListener('click', this.#playPauseFunc.bind(this));
  }

  // #playPauseFunc(e) {
  //   if (e.target.closest('.play')) {
  //     this.videoEl.play();
  //     this.btnAnimation.classList.remove('btn--active');
  //   }
  //   if (e.target.closest('.pause')) {
  //     this.videoEl.pause();
  //     this.btnAnimation.classList.add('btn--active');
  //   }
  // }
}

export default new VideoControlView();
