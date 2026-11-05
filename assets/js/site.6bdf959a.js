document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');
try {
(function () {
'use strict';
var toggle = document.querySelector('.nav-toggle');
var nav = document.getElementById('site-nav');
if (!toggle || !nav) return;
var label = toggle.querySelector('.nav-toggle__text');
var root = document.documentElement;
var setOpen = function (open, returnFocus) {
toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
nav.classList.toggle('is-open', open);
root.classList.toggle('menu-open', open);
if (label) label.textContent = open ? 'Close menu' : 'Menu';
if (!open && returnFocus) toggle.focus();
};
toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true', false); });
document.addEventListener('keydown', function (e) {
if ((e.key === 'Escape' || e.key === 'Esc') && toggle.getAttribute('aria-expanded') === 'true' && !document.querySelector('.nav__toggle[aria-expanded="true"]')) {
setOpen(false, true);
}
});
nav.addEventListener('focusout', function (e) {
var to = e.relatedTarget;
if (toggle.getAttribute('aria-expanded') === 'true' && to && !nav.contains(to) && !toggle.contains(to)) setOpen(false, false);
});
var mq = window.matchMedia('(min-width: 75em)');
var onMq = function () { if (mq.matches) setOpen(false, false); };
if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
root.classList.add('js-menu');
})();
} catch (e) { if (window.console) console.warn('paxis module 10-menu failed', e); }
try {
(function () {
'use strict';
var items = Array.prototype.slice.call(document.querySelectorAll('.nav__item.has-sub'));
if (!items.length) return;
var wide = window.matchMedia('(min-width: 75em) and (hover: hover)');
var timers = new WeakMap();
var hoverOpenedAt = new WeakMap();
var btnOf = function (li) { return li.querySelector('.nav__toggle'); };
var setOpen = function (li, open) {
var b = btnOf(li);
if (!b) return;
b.setAttribute('aria-expanded', open ? 'true' : 'false');
li.classList.toggle('is-open', open);
};
var closeAll = function (except) { items.forEach(function (li) { if (li !== except) setOpen(li, false); }); };
items.forEach(function (li) {
var b = btnOf(li);
if (!b) return;
b.addEventListener('click', function () {
var open = b.getAttribute('aria-expanded') !== 'true';
if (!open && Date.now() - (hoverOpenedAt.get(li) || 0) < 700) return;
closeAll(li);
setOpen(li, open);
});
li.addEventListener('keydown', function (e) {
if ((e.key === 'Escape' || e.key === 'Esc') && li.classList.contains('is-open')) {
e.stopPropagation();
setOpen(li, false);
b.focus();
}
});
li.addEventListener('focusout', function (e) {
if (e.relatedTarget && !li.contains(e.relatedTarget)) setOpen(li, false);
});
li.addEventListener('mouseenter', function () {
if (!wide.matches) return;
clearTimeout(timers.get(li));
closeAll(li);
if (b.getAttribute('aria-expanded') !== 'true') hoverOpenedAt.set(li, Date.now());
setOpen(li, true);
});
li.addEventListener('mouseleave', function () {
if (!wide.matches) return;
timers.set(li, setTimeout(function () { setOpen(li, false); }, 180));
});
});
document.addEventListener('click', function (e) {
if (!e.target.closest || !e.target.closest('.nav__item.has-sub')) closeAll(null);
});
document.documentElement.classList.add('js-submenus');
})();
} catch (e) { if (window.console) console.warn('paxis module 20-submenus failed', e); }
try {
(function () {
'use strict';
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
var clips = Array.prototype.slice.call(document.querySelectorAll('[data-clip]'));
clips.forEach(function (fig) {
var video = fig.querySelector('video');
var btn = fig.querySelector('.clip__toggle');
if (!video || !btn) return;
var text = btn.querySelector('.clip__toggle-text');
var userPaused = false, userPlayed = false, visible = false;
var render = function () {
text.textContent = video.paused ? 'Play clip' : 'Pause clip';
fig.classList.toggle('is-playing', !video.paused);
};
var tryPlay = function () {
if (userPaused || !visible || (reduce.matches && !userPlayed)) return;
if (video.preload !== 'auto') video.preload = 'auto';
var p = video.play();
if (p && p.catch) p.catch(function () { render(); });
};
video.addEventListener('error', function () { fig.classList.add('is-failed'); btn.hidden = true; }, true);
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
}
});
var onReduce = function () {
if (!reduce.matches) return;
clips.forEach(function (fig) { var v = fig.querySelector('video'); if (v && !v.paused) v.pause(); });
};
if (reduce.addEventListener) reduce.addEventListener('change', onReduce);
})();
} catch (e) { if (window.console) console.warn('paxis module 30-clips failed', e); }
try {
(function () {
'use strict';
var links = Array.prototype.slice.call(document.querySelectorAll('.rail a[href^="#"]'));
if (!links.length || !('IntersectionObserver' in window)) return;
var map = new Map();
links.forEach(function (a) {
var t = document.getElementById(a.getAttribute('href').slice(1));
if (t) map.set(t, a);
});
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (e) {
if (e.isIntersecting) {
links.forEach(function (x) { x.classList.remove('is-active'); });
var a = map.get(e.target);
if (a) a.classList.add('is-active');
}
});
}, { rootMargin: '-25% 0px -65% 0px' });
map.forEach(function (a, t) { io.observe(t); });
})();
} catch (e) { if (window.console) console.warn('paxis module 40-rail failed', e); }
try {
(function () {
'use strict';
var open = function () {
var id;
try { id = decodeURIComponent((location.hash || '').slice(1)); } catch (e) { return; }
if (!id) return;
var el = document.getElementById(id);
if (el && el.tagName === 'DETAILS') el.open = true;
};
open();
window.addEventListener('hashchange', open);
})();
} catch (e) { if (window.console) console.warn('paxis module 50-faq-hash failed', e); }
