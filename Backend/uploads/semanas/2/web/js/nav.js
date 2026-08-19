(function () {
  const aqui = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.principal a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === aqui) a.classList.add("activo");
  });
})();
