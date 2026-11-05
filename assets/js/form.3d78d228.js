(function () {
'use strict';
var form = document.querySelector('[data-quote-form]');
if (!form) return;
var isPreview = document.documentElement.getAttribute('data-preview') === 'true';
var summary = document.getElementById('error-summary');
var summaryTitle = document.getElementById('error-summary-title');
var summaryList = summary.querySelector('ul');
var status = document.getElementById('form-status');
var button = form.querySelector('button[type="submit"]');
var buttonLabel = button.textContent;
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var attempted = false;
var sending = false;
form.setAttribute('novalidate', '');
var previewNote = document.querySelector('[data-preview-note]');
if (isPreview && previewNote) previewNote.hidden = false;
var pad = function (n) { return (n < 10 ? '0' : '') + n; };
var now = new Date();
var today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
var dateField = form.querySelector('#f-date');
if (dateField) dateField.min = today;
var desc = form.querySelector('#f-description');
var counter = form.querySelector('[data-counter-for="f-description"]');
var updateCounter = function () {
if (!desc || !counter) return;
var n = desc.value.length;
counter.textContent = n === 0 ? 'Up to 2,000 characters' : n.toLocaleString('en-US') + ' of 2,000 characters';
};
if (desc) desc.addEventListener('input', updateCounter);
var fields = Array.prototype.slice.call(form.querySelectorAll('input[id^="f-"], select[id^="f-"], textarea[id^="f-"]'));
var check = function (el) {
var v = (el.value || '').trim();
var d = el.dataset;
if (el.required && v === '') return d.msgRequired;
if (el.type === 'email' && v !== '' && (!EMAIL.test(v) || v.length > 254)) return d.msgInvalid;
if (el.id === 'f-description' && v !== '') {
if (v.length < 10) return d.msgShort;
if (el.value.length > 2000) return d.msgLong;
}
if (el.id === 'f-date' && el.value !== '') {
if (!/^\d{4}-\d{2}-\d{2}$/.test(el.value) || el.value < today) return d.msgPast;
}
if (el.maxLength > 0 && el.value.length > el.maxLength) return d.msgLong || d.msgRequired;
return '';
};
var show = function (el, msg) {
var err = document.getElementById(el.id + '-error');
if (!err) return;
if (msg) {
err.textContent = msg;
err.hidden = false;
el.setAttribute('aria-invalid', 'true');
} else {
err.textContent = '';
err.hidden = true;
el.removeAttribute('aria-invalid');
}
};
var validateAll = function () {
var errors = [];
fields.forEach(function (el) {
var msg = check(el);
show(el, msg);
if (msg) errors.push({ el: el, msg: msg });
});
return errors;
};
var renderSummary = function (errors) {
summaryList.textContent = '';
if (!errors.length) { summary.hidden = true; return; }
summaryTitle.textContent = errors.length === 1
? 'There is 1 problem with your request:'
: 'There are ' + errors.length + ' problems with your request:';
errors.forEach(function (e) {
var li = document.createElement('li');
var a = document.createElement('a');
a.href = '#' + e.el.id;
a.textContent = e.msg;
a.addEventListener('click', function (ev) {
ev.preventDefault();
e.el.focus();
var label = form.querySelector('label[for="' + e.el.id + '"]');
if (label && label.scrollIntoView) label.scrollIntoView({ block: 'center' });
});
li.appendChild(a);
summaryList.appendChild(li);
});
summary.hidden = false;
};
fields.forEach(function (el) {
var revalidate = function () {
if (!attempted) return;
show(el, check(el));
if (!summary.hidden) {
var remaining = fields.map(function (f) { var m = check(f); return m ? { el: f, msg: m } : null; }).filter(Boolean);
renderSummary(remaining);
}
};
el.addEventListener('blur', revalidate);
if (el.tagName === 'SELECT' || el.type === 'date') el.addEventListener('change', revalidate);
});
var setSending = function (on) {
sending = on;
button.disabled = on;
button.textContent = on ? button.getAttribute('data-label-sending') : buttonLabel;
};
form.addEventListener('submit', function (ev) {
attempted = true;
status.hidden = true;
var errors = validateAll();
if (errors.length) {
ev.preventDefault();
renderSummary(errors);
summary.focus();
return;
}
renderSummary([]);
ev.preventDefault();
if (sending) return;
if (isPreview) {
if (previewNote) { previewNote.hidden = false; previewNote.setAttribute('tabindex', '-1'); previewNote.focus(); }
return;
}
setSending(true);
var body = new URLSearchParams(new FormData(form)).toString();
fetch('/', {
method: 'POST',
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
body: body
}).then(function (res) {
if (!res.ok) throw new Error('HTTP ' + res.status);
window.location.assign(form.getAttribute('action'));
}).catch(function () {
setSending(false);
status.hidden = false;
status.setAttribute('tabindex', '-1');
status.focus();
});
});
})();
