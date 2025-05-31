const burger = document.getElementById("burger");
const menu = document.getElementById("nav-menu");

burger?.addEventListener("click", () => {
  menu?.classList.toggle("hidden");
});
