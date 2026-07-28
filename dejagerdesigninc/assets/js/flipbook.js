(function () {
  var PAGE_COUNT = 21;
  var pages = [];
  for (var i = 1; i <= PAGE_COUNT; i++) {
    var n = i < 10 ? '0' + i : '' + i;
    pages.push('assets/pages/page_' + n + '.jpg');
  }

  var bookEl = document.getElementById('book');
  var prevBtn = document.getElementById('fb-prev');
  var nextBtn = document.getElementById('fb-next');
  var indicator = document.getElementById('fb-page-indicator');

  // StPageFlip already adapts continuously to the container's live size: it
  // shows a single page ("portrait") when the container is narrower than
  // 2x minWidth, and a two-page spread ("landscape") once it's wider, and it
  // recalculates on every window resize on its own. minWidth/maxWidth are
  // tuned so phones land in single-page mode and any wider window (tablet,
  // laptop, desktop) gets the two-page spread -- no manual breakpoint logic
  // needed.
  var pageFlip = new St.PageFlip(bookEl, {
    width: 700,
    height: 495,
    size: 'stretch',
    minWidth: 360,
    maxWidth: 800,
    minHeight: 255,
    maxHeight: 566,
    // autoSize sets an inline max-width of 2x maxWidth on the container,
    // which silently overrides the CSS max-width on .fb-book. Disabling it
    // keeps sizing under CSS control.
    autoSize: false,
    showCover: true,
    usePortrait: true,
    maxShadowOpacity: 0.5,
    flippingTime: 700,
    mobileScrollSupport: true,
  });

  function updateIndicator() {
    var current = pageFlip.getCurrentPageIndex() + 1;
    indicator.textContent = current + ' / ' + PAGE_COUNT;
    prevBtn.disabled = current <= 1;
    nextBtn.disabled = current >= PAGE_COUNT;
  }

  pageFlip.on('init', updateIndicator);
  pageFlip.on('flip', updateIndicator);

  pageFlip.loadFromImages(pages);

  prevBtn.addEventListener('click', function () {
    pageFlip.flipPrev();
  });
  nextBtn.addEventListener('click', function () {
    pageFlip.flipNext();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') pageFlip.flipNext();
    if (e.key === 'ArrowLeft') pageFlip.flipPrev();
  });

  // ---- Deterrents against casual downloading ----
  // Note: this is a static, client-rendered page -- these measures discourage
  // casual saving (right-click, drag) but cannot provide real DRM, since the
  // browser must download the images to display them.
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });
})();
