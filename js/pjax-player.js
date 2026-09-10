(function () {
  'use strict';

  function isSameOrigin(url) {
    return url.origin === window.location.origin;
  }

  function shouldSkip(href, a) {
    if (!href || href.charAt(0) === '#') {
      return true;
    }
    if (a.target === '_blank' || a.hasAttribute('download')) {
      return true;
    }
    if (/^https?:|^mailto:|^tel:|^javascript:/i.test(href)) {
      return true;
    }
    if (/\.(mp3|m4a|wav|jpg|jpeg|png|gif|webp|svg|ico|pdf|zip|xml|json|css|js)(\?.*)?$/i.test(href)) {
      return true;
    }
    return false;
  }

  function updateBanner(doc) {
    var nextBanner = doc.querySelector('#banner');
    var currentBanner = document.querySelector('#banner');

    if (nextBanner && currentBanner) {
      currentBanner.style.cssText = nextBanner.style.cssText;
      currentBanner.innerHTML = nextBanner.innerHTML;

      ['class', 'parallax', 'data-random-banner'].forEach(function (attr) {
        if (nextBanner.hasAttribute(attr)) {
          currentBanner.setAttribute(attr, nextBanner.getAttribute(attr));
        } else {
          currentBanner.removeAttribute(attr);
        }
      });
    }

    var nextHeaderInner = doc.querySelector('.header-inner');
    var currentHeaderInner = document.querySelector('.header-inner');
    if (nextHeaderInner && currentHeaderInner && nextHeaderInner.style.height) {
      currentHeaderInner.style.height = nextHeaderInner.style.height;
    }
  }

  function swapContent(html, url, push) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var nextMain = doc.querySelector('main');
    var currentMain = document.querySelector('main');

    if (!nextMain || !currentMain) {
      window.location.href = url;
      return;
    }

    nextMain.querySelectorAll('script').forEach(function (script) {
      script.parentNode.removeChild(script);
    });

    currentMain.innerHTML = nextMain.innerHTML;
    updateBanner(doc);

    var nextTitle = doc.querySelector('title');
    if (nextTitle) {
      document.title = nextTitle.textContent;
    }

    if (push) {
      window.history.pushState({ url: url }, '', url);
    }

    window.scrollTo(0, 0);

    if (window.Fluid && Fluid.boot && Fluid.boot.refresh) {
      Fluid.boot.refresh();
    }
  }

  function load(url, push) {
    fetch(url, { credentials: 'same-origin' }).then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.text();
    }).then(function (html) {
      swapContent(html, url, push);
    }).catch(function () {
      window.location.href = url;
    });
  }

  function onClick(event) {
    if (event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    var target = event.target;
    var a = target && target.closest ? target.closest('a') : null;
    if (!a) {
      return;
    }

    var href = a.getAttribute('href') || '';
    if (shouldSkip(href, a)) {
      return;
    }

    var url = new URL(href, window.location.href);
    if (!isSameOrigin(url)) {
      return;
    }

    event.preventDefault();
    load(url.href, true);
  }

  function onPopState() {
    load(window.location.href, false);
  }

  document.addEventListener('click', onClick);
  window.addEventListener('popstate', onPopState);
})();
