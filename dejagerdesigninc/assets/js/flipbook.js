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

  // Each source page is an independent full design (not a left/right spread
  // half), so the book must always show one page at a time. StPageFlip
  // decides portrait vs. landscape from the container's live CSS width, and
  // switches to single-page ("portrait") mode only when that width is below
  // 2x minWidth -- so the .fb-book CSS max-width (see flipbook.css) is kept
  // below that threshold to force single-page display at every screen size.
  var pageFlip = new St.PageFlip(bookEl, {
    width: 640,
    height: 453,
    size: 'stretch',
    minWidth: 350,
    maxWidth: 640,
    minHeight: 248,
    maxHeight: 453,
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
