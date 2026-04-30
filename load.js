const COMPONENT_CACHE_KEY = "noor_component_cache_v4";
const OLD_COMPONENT_CACHE_KEYS = ["noor_component_cache_v1", "noor_component_cache_v2", "noor_component_cache_v3"];

OLD_COMPONENT_CACHE_KEYS.forEach((key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors on restricted browsers.
  }
});

function readComponentCache() {
  try {
    return JSON.parse(localStorage.getItem(COMPONENT_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeComponentCache(cache) {
  try {
    localStorage.setItem(COMPONENT_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage errors on restricted browsers.
  }
}

function mountComponent(id, data) {
  const container = document.getElementById(id);
  if (!container) return;

  const shouldReplace = container.innerHTML !== data;
  if (shouldReplace) {
    container.innerHTML = data;
  }

  if (id === "header") {
    applyHeaderOffset();
    initHeader();
    setActiveNav();
  }
}

function loadComponent(id, file) {
  const cache = readComponentCache();
  const cachedData = cache[file];
  if (cachedData) {
    mountComponent(id, cachedData);
  }

  fetch(file, { cache: "force-cache" })
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return response.text();
    })
    .then(data => {
      mountComponent(id, data);
      if (cache[file] !== data) {
        cache[file] = data;
        writeComponentCache(cache);
      }
    })
    .catch(() => {
      // Keep cached content if available; avoid breaking page on flaky mobile network.
      if (!cachedData) {
        const container = document.getElementById(id);
        if (container) container.innerHTML = "";
      }
    });
}

function applyHeaderOffset() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  document.body.style.paddingTop = `${header.offsetHeight}px`;
}

function initHeader() {
  const dropdown = document.querySelector(".dropdown");
  const programsTrigger = document.querySelector(".nav-link--programs");

  if (dropdown && programsTrigger) {
    programsTrigger.addEventListener("click", function (event) {
      if (window.innerWidth <= 992) return;
      event.preventDefault();
      dropdown.classList.toggle("open");
    });

    if (!window.__headerOutsideClickBound) {
      document.addEventListener("click", function (event) {
        const openDropdown = document.querySelector(".dropdown.open");
        if (!openDropdown) return;
        if (!openDropdown.contains(event.target)) {
          openDropdown.classList.remove("open");
        }
      });
      window.__headerOutsideClickBound = true;
    }
  }

  window.toggleMenu = function () {
    const navMenu = document.getElementById("navMenu");
    const btn = document.querySelector(".menu-toggle");
    if (navMenu) navMenu.classList.toggle("show");
    if (btn && navMenu) {
      const open = navMenu.classList.contains("show");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  };

  window.togglePrograms = function (event) {
    event.preventDefault();
    const submenu = document.getElementById("mobileProgramsMenu");
    if (submenu) submenu.classList.toggle("show");
  };

  window.toggleProgramGroup = function (event, panelId) {
    event.preventDefault();
    event.stopPropagation();

    const panel = document.getElementById(panelId);
    if (!panel) return;

    const container = panel.closest(".dropdown-menu, .mobile-submenu");
    if (!container) return;

    const wasOpen = panel.classList.contains("show");

    container.querySelectorAll(".program-group-list").forEach(list => {
      list.classList.remove("show");
    });

    container.querySelectorAll(".program-group-toggle").forEach(btn => {
      btn.setAttribute("aria-expanded", "false");
    });

    if (!wasOpen) {
      panel.classList.add("show");
      const button = container.querySelector(
        `.program-group-toggle[data-target="${panelId}"]`
      );
      if (button) button.setAttribute("aria-expanded", "true");
    }
  };
}

window.addEventListener("resize", applyHeaderOffset);

function setActiveNav() {
  let page = window.location.pathname.split("/").pop();
  if (!page) page = "index.html";
  const departmentPages = [
    "programs.html",
    "ourcourse.html",
    "management.html",
    "bcom.html",
    "bbaaviation.html",
    "bba.html",
    "bcomlogistics.html",
    "bca.html",
    "pharmacy.html",
    "bpharmacy.html",
    "dpharmacy.html",
    "alliedhealth.html",
    "bscatott.html",
    "bscmit-radiology.html",
    "bscmlt.html",
    "bsccct.html",
    "physiotherapy.html",
    "bpt.html",
    "occupationaltherapy.html",
    "bot.html",
    "hospitaladministration.html",
    "bha.html",
    "gnm.html",
    "bscnursing.html",
    "pbBsc.html",
    "mscnursing.html",
  ];

  document.body.classList.remove("department-page");
  if (departmentPages.includes(page)) {
    document.body.classList.add("department-page");
  }

  document.querySelectorAll("#navMenu a.active").forEach(a => {
    a.classList.remove("active");
    a.removeAttribute("aria-current");
  });

  document.querySelectorAll("#navMenu a[href]").forEach(link => {
    const href = link.getAttribute("href")?.split("#")[0];
    if (!href) return;
    const hrefPage = href.split("/").pop();
    if (hrefPage === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

loadComponent("header", "headers/header.html");
loadComponent("footer", "headers/footer.html");