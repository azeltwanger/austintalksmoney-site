// Sends each form to its Kit form in the background and shows the thank-you state on the page.
// Without JavaScript the form still posts straight to Kit.
document.querySelectorAll('form[data-kit]').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type=submit]');
    var err = form.querySelector('.err');
    if (err) err.remove();
    btn.disabled = true;
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && (!res.j.status || res.j.status === 'success')) { form.classList.add('ok'); return; }
        // Kit's spam check wants a human check: hand over to Kit's own page, which shows it.
        if (res.ok && res.j.status === 'quarantined') { HTMLFormElement.prototype.submit.call(form); return; }
        throw new Error('signup');
      })
      .catch(function () {
        btn.disabled = false;
        var p = document.createElement('p');
        p.className = 'err';
        p.setAttribute('role', 'alert');
        p.textContent = "That didn't go through. Check your email and try again.";
        btn.insertAdjacentElement('afterend', p);
      });
  });
});
