(function () {
'use strict';
var root = document.documentElement;
root.classList.remove('no-js');
root.classList.add('js');
var toggle = document.querySelector('.nav-toggle');
var nav = document.getElementById('site-nav');
if (toggle && nav) {
var label = toggle.querySelector('.nav-toggle__text');
var setOpen = function (open, returnFocus) {
toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
nav.classList.toggle('is-open', open);
if (label) label.textContent = open ? 'Close menu' : 'Menu';
if (!open && returnFocus) toggle.focus();
};
toggle.addEventListener('click', function () {
setOpen(toggle.getAttribute('aria-expanded') !== 'true', false);
});
document.addEventListener('keydown', function (e) {
if ((e.key === 'Escape' || e.key === 'Esc') && toggle.getAttribute('aria-expanded') === 'true') {
setOpen(false, true);
}
});
document.addEventListener('click', function (e) {
if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target) && !toggle.contains(e.target)) {
setOpen(false, false);
}
});
nav.addEventListener('focusout', function (e) {
var to = e.relatedTarget;
if (toggle.getAttribute('aria-expanded') === 'true' && to && !nav.contains(to) && !toggle.contains(to)) {
setOpen(false, false);
}
});
var mq = window.matchMedia('(min-width: 64em)');
var onMq = function () { if (mq.matches) setOpen(false, false); };
if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
}
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
var clips = Array.prototype.slice.call(document.querySelectorAll('[data-clip]'));
clips.forEach(function (fig) {
var video = fig.querySelector('video');
var btn = fig.querySelector('.clip__toggle');
if (!video || !btn) return;
var text = btn.querySelector('.clip__toggle-text');
var userPaused = false;
var userPlayed = false;
var visible = false;
var render = function () {
var playing = !video.paused;
text.textContent = playing ? 'Pause clip' : 'Play clip';
};
var tryPlay = function () {
if (userPaused || !visible || (reduce.matches && !userPlayed)) return;
if (video.preload !== 'auto') video.preload = 'auto';
var p = video.play();
if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays */ render(); });
};
btn.hidden = false;
btn.addEventListener('click', function () {
if (video.paused) { userPaused = false; userPlayed = true; visible = true; tryPlay(); }
else { userPaused = true; video.pause(); }
});
video.addEventListener('play', render);
video.addEventListener('pause', render);
render();
if ('IntersectionObserver' in window) {
new IntersectionObserver(function (entries) {
entries.forEach(function (en) {
visible = en.isIntersecting;
if (visible) tryPlay(); else if (!video.paused) video.pause();
});
}, { rootMargin: '100px 0px' }).observe(fig);
} else {
visible = true; tryPlay();
}
});
var onReduce = function () {
if (!reduce.matches) return;
clips.forEach(function (fig) { var v = fig.querySelector('video'); if (v && !v.paused) v.pause(); });
};
if (reduce.addEventListener) reduce.addEventListener('change', onReduce);
})();
