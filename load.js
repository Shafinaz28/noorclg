function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;

      if (id === "header") {
        applyHeaderOffset();
        initHeader();
        setActiveNav();
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

    document.addEventListener("click", function (event) {
      if (!dropdown.classList.contains("open")) return;
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("open");
      }
    });
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