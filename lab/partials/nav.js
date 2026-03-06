/* ============================================================
   G.A.L. Shared Nav Loader + Dropdown Behavior + Auto Position
   Place this file at: /partials/nav.js

   Usage per page:
     <div id="nav-slot"></div>
     <script>window.SITE_ROOT = "../..";</script>
     <link rel="stylesheet" href="../../partials/nav.css">
     <script src="../../partials/nav.js" defer></script>

   SITE_ROOT examples:
     /index.html                         -> "."
     /tools/fr-reports/index.html        -> "../.."
     /tools/calibrations/index.html      -> "../.."
   ============================================================ */

(async function () {
  const slot = document.getElementById("nav-slot");
  if (!slot) return;

  const root = (window.SITE_ROOT ?? ".").replace(/\/+$/, "");

  try {
    const res = await fetch(`${root}/partials/nav.html`, { cache: "no-store" });
    if (!res.ok) throw new Error(`nav.html missing: ${res.status}`);
    slot.innerHTML = await res.text();

    // Rewrite links
    slot.querySelectorAll("[data-root-href]").forEach((a) => {
      const rel = a.getAttribute("data-root-href") || "";
      const href = `${root}/${rel}`.replace(/\/{2,}/g, "/");
      a.setAttribute("href", href);
    });

    setNavHeightVar();

    // Desktop dropdown
    enableDropdownClick();
    bindToolsDropdownAutoPosition();
    highlightActiveNav();

    // Mobile drawer
    enableMobileMenu();

    window.addEventListener("resize", setNavHeightVar, { passive: true });
  } catch (err) {
    console.error(err);
    slot.innerHTML = `
      <div style="padding:12px 16px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03); color:#fca5a5; font:12px ui-monospace;">
        Failed to load /partials/nav.html
      </div>
    `;
  }

  // Helpers
  function setNavHeightVar() {
    const nav = document.getElementById("navbar");
    if (!nav) return;
    document.documentElement.style.setProperty(
      "--nav-h",
      `${Math.round(nav.getBoundingClientRect().height || 64)}px`
    );
  }

  function highlightActiveNav() {
    const here = location.pathname.replace(/\/+$/, "");
    slot.querySelectorAll("a[href]").forEach((a) => {
      try {
        const url = new URL(a.href, location.href);
        const p = url.pathname.replace(/\/+$/, "");
        if (p === here) a.classList.add("text-white");
      } catch {}
    });
  }

  // Desktop: dropdown
  function enableDropdownClick() {
    const dd = document.getElementById("tools-dd");
    const btn = document.getElementById("tools-btn");
    if (!dd || !btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const open = !dd.classList.contains("dd-open");
      dd.classList.toggle("dd-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      positionToolsDropdown();
    });

    document.addEventListener("click", (e) => {
      if (!dd.classList.contains("dd-open")) return;
      if (dd.contains(e.target)) return;
      dd.classList.remove("dd-open");
      btn.setAttribute("aria-expanded", "false");
    });

    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!dd.classList.contains("dd-open")) return;
      dd.classList.remove("dd-open");
      btn.setAttribute("aria-expanded", "false");
      btn.focus({ preventScroll: true });
    });
  }

  function positionToolsDropdown() {
    const dd = document.getElementById("tools-dd");
    const panel = document.getElementById("tools-panel");
    if (!dd || !panel) return;

    dd.classList.remove("right-open");

    const prev = {
      opacity: panel.style.opacity,
      pointerEvents: panel.style.pointerEvents,
      transform: panel.style.transform,
      transition: panel.style.transition,
    };

    panel.style.transition = "none";
    panel.style.opacity = "0";
    panel.style.pointerEvents = "none";
    panel.style.transform = "translateY(0px)";

    const rectLeft = panel.getBoundingClientRect();
    if (rectLeft.right > window.innerWidth - 10) dd.classList.add("right-open");

    const rectFinal = panel.getBoundingClientRect();
    if (rectFinal.left < 10) dd.classList.remove("right-open");

    panel.style.opacity = prev.opacity;
    panel.style.pointerEvents = prev.pointerEvents;
    panel.style.transform = prev.transform;
    panel.style.transition = prev.transition;
  }

  function bindToolsDropdownAutoPosition() {
    const dd = document.getElementById("tools-dd");
    const btn = document.getElementById("tools-btn");
    if (!dd || !btn) return;

    dd.addEventListener("mouseenter", positionToolsDropdown, { passive: true });
    btn.addEventListener("focus", positionToolsDropdown, { passive: true });
    btn.addEventListener("click", positionToolsDropdown, { passive: true });

    window.addEventListener("resize", positionToolsDropdown, { passive: true });
    window.addEventListener("scroll", positionToolsDropdown, { passive: true });
  }

  // Mobile: drawer menu
  function enableMobileMenu() {
    const openBtn = document.getElementById("mobile-menu-btn");
    const closeBtn = document.getElementById("mobile-menu-close");
    const panel = document.getElementById("mobile-menu-panel");
    const backdrop = document.getElementById("mobile-menu-backdrop");
    if (!openBtn || !closeBtn || !panel || !backdrop) return;

    let lastFocus = null;

    function openMenu() {
      lastFocus = document.activeElement;
      document.documentElement.classList.add("mnav-open");
      openBtn.setAttribute("aria-expanded", "true");
      backdrop.setAttribute("aria-hidden", "false");
      // focus panel for ESC + accessibility
      setTimeout(() => panel.focus({ preventScroll: true }), 0);
    }

    function closeMenu() {
      document.documentElement.classList.remove("mnav-open");
      openBtn.setAttribute("aria-expanded", "false");
      backdrop.setAttribute("aria-hidden", "true");
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      lastFocus = null;
    }

    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = document.documentElement.classList.contains("mnav-open");
      isOpen ? closeMenu() : openMenu();
    });

    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
    });

    backdrop.addEventListener("click", closeMenu);

    panel.querySelectorAll("a[href]").forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!document.documentElement.classList.contains("mnav-open")) return;
      closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeMenu();
    }, { passive: true });
  }
})();
