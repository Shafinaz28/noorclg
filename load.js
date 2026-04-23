function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;

      if (id === "header") {
        initHeader();
        setActiveNav();
      }
    });
}

function initHeader() {
  window.toggleMenu = function () {
    const navMenu = document.getElementById("navMenu");
    if (navMenu) navMenu.classList.toggle("show");
  };

  window.togglePrograms = function (event) {
    event.preventDefault();
    const submenu = document.getElementById("mobileProgramsMenu");
    if (submenu) submenu.classList.toggle("show");
  };
}

function setActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#navMenu a").forEach(link => {
    const href = link.getAttribute("href");
    if (href && href.split("#")[0] === page) {
      link.classList.add("active");
    }
  });
}

loadComponent("header", "headers/header.html");
loadComponent("footer", "headers/footer.html");