/**
 * Photo wall: mouse-drag / touch-swipe scrolling + click-to-zoom lightbox
 * with next/prev navigation within each row.
 */
(function () {
  // ---- Drag-to-scroll for each row ----
  document.querySelectorAll('.wall-track').forEach(function (track) {
    var isDown = false;
    var startX = 0;
    var scrollStart = 0;
    var moved = false;

    function start(x) {
      isDown = true;
      moved = false;
      startX = x;
      scrollStart = track.scrollLeft;
      track.classList.add('dragging');
    }

    function move(x) {
      if (!isDown) return;
      var dx = x - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = scrollStart - dx;
    }

    function end() {
      isDown = false;
      track.classList.remove('dragging');
    }

    track.addEventListener('mousedown', function (e) {
      start(e.pageX);
      e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      move(e.pageX);
    });
    window.addEventListener('mouseup', end);
    track.addEventListener('mouseleave', function () {
      if (isDown) end();
    });

    // Prevent the click-to-zoom handler from firing right after a drag
    track.addEventListener(
      'click',
      function (e) {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  });

  // ---- Lightbox ----
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');

  if (!lightbox) return;

  var groups = {}; // group id -> [items in DOM order]
  document.querySelectorAll('.wall-item').forEach(function (item) {
    var group = item.getAttribute('data-row');
    groups[group] = groups[group] || [];
    groups[group].push(item);
  });

  var currentGroup = null;
  var currentIndex = 0;

  function show(groupId, index) {
    var items = groups[groupId];
    if (!items || !items.length) return;
    currentGroup = groupId;
    currentIndex = (index + items.length) % items.length;
    var item = items[currentIndex];
    lightboxImage.src = item.getAttribute('data-large') + '.jpg';
    lightboxImage.alt = item.querySelector('img').alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
  }

  function next() {
    show(currentGroup, currentIndex + 1);
  }

  function prev() {
    show(currentGroup, currentIndex - 1);
  }

  document.querySelectorAll('.wall-item').forEach(function (item) {
    item.addEventListener('click', function () {
      show(item.getAttribute('data-row'), parseInt(item.getAttribute('data-index'), 10));
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(item.getAttribute('data-row'), parseInt(item.getAttribute('data-index'), 10));
      }
    });
  });

  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
})();
