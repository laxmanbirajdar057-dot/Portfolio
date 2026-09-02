(function () {
  "use strict";

  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var STORAGE_KEY = "lb-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      var isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
  }

  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(stored || (prefersLight ? "light" : "dark"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  // Mobile menu
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(open));
      hamburger.classList.toggle("active", open);
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Sticky nav shadow
  var navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });

  // Terminal typing animation (single orchestrated hero moment)
  var body = document.getElementById("terminalBody");
  if (body) {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var lines = [
      { text: "docker build -t app:latest .", type: "cmd" },
      { text: "terraform apply -auto-approve", type: "cmd" },
      { text: "kubectl rollout status deployment/app", type: "cmd" },
      { text: "\u2713 deployment successful", type: "ok" }
    ];

    if (reduceMotion) {
      body.innerHTML = lines.map(function (l) {
        var cls = l.type === "ok" ? "line-ok" : "line-cmd";
        return '<div class="' + cls + '">' + l.text + "</div>";
      }).join("");
    } else {
      var lineIndex = 0, charIndex = 0;
      var container = null;

      function typeChar() {
        if (lineIndex >= lines.length) {
          var caret = document.createElement("span");
          caret.className = "caret";
          body.appendChild(caret);
          return;
        }
        var current = lines[lineIndex];
        if (charIndex === 0) {
          container = document.createElement("div");
          container.className = current.type === "ok" ? "line-ok" : "line-cmd";
          body.appendChild(container);
        }
        if (charIndex <= current.text.length) {
          container.textContent = current.text.slice(0, charIndex);
          charIndex++;
          setTimeout(typeChar, current.type === "ok" ? 18 : 32);
        } else {
          lineIndex++;
          charIndex = 0;
          setTimeout(typeChar, 260);
        }
      }
      setTimeout(typeChar, 500);
    }
  }
})();