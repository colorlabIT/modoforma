(function () {
  var PAGE_COUNT = 21;
  var pages = [];
  for (var i = 1; i <= PAGE_COUNT; i++) {
    var n = i < 10 ? '0' + i : '' + i;
    pages.push('assets/pages/page_' + n + '.jpg');
  }

  var bookWrap = document.getElementById('book-wrap');
  var prevBtn = document.getElementById('fb-prev');
  var nextBtn = document.getElementById('fb-next');
  var indicator = document.getElementById('fb-page-indicator');

  // Each source page is an independent full design (not a left/right spread
  // half), so the book must always show one page at a time. StPageFlip
  // decides portrait vs. landscape from the container's live CSS width, and
  // switches to single-page ("portrait") mode only when that width is below
  // 2x minWidth. minWidth also becomes a hard floor width on the container
  // (the library sets it as an inline style), so a single config can't both
  // stay mobile-safe and fill wide desktop screens -- hence two profiles,
  // matching the breakpoint in flipbook.css, swapped via matchMedia.
  var WIDE_QUERY = '(min-width: 800px)';
  var PROFILES = {
    small: { width: 640, height: 453, minWidth: 350, maxWidth: 640, minHeight: 248, maxHeight: 453 },
    wide: { width: 1200, height: 849, minWidth: 650, maxWidth: 1200, minHeight: 460, maxHeight: 849 },
  };
  var COMMON_SETTINGS = {
    size: 'stretch',
    // autoSize sets an inline max-width of 2x maxWidth on the container,
    // which silently overrides the CSS max-width on .fb-book and lets the
    // container grow wide enough to trigger the library's landscape
    // (2-page spread) mode. Disabling it keeps sizing under CSS control.
    autoSize: false,
    showCover: true,
    usePortrait: true,
    maxShadowOpacity: 0.5,
    flippingTime: 700,
    mobileScrollSupport: true,
  };

  var mql = window.matchMedia(WIDE_QUERY);
  var pageFlip = null;

  function updateIndicator() {
    var current = pageFlip.getCurrentPageIndex() + 1;
    indicator.textContent = current + ' / ' + PAGE_COUNT;
    prevBtn.disabled = current <= 1;
    nextBtn.disabled = current >= PAGE_COUNT;
  }

  function buildPageFlip(startPage) {
    var profile = mql.matches ? PROFILES.wide : PROFILES.small;
    bookWrap.classList.toggle('fb-book--wide', mql.matches);

    // PageFlip.destroy() removes its target element from the DOM (block.remove()),
    // so the element it's attached to must be a disposable child of the stable
    // book-wrap container, recreated fresh on every profile switch.
    var bookEl = document.createElement('div');
    bookEl.id = 'book';
    bookWrap.appendChild(bookEl);

    var settings = Object.assign({ startPage: startPage || 0 }, COMMON_SETTINGS, profile);
    pageFlip = new St.PageFlip(bookEl, settings);
    pageFlip.on('init', updateIndicator);
    pageFlip.on('flip', updateIndicator);
    pageFlip.loadFromImages(pages);
  }

  buildPageFlip(0);

  mql.addEventListener('change', function () {
    var currentPage = pageFlip.getCurrentPageIndex();
    pageFlip.destroy();
    buildPageFlip(currentPage);
  });

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
