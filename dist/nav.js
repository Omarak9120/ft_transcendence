"use strict";
const burger = document.getElementById("burger");
const menu = document.getElementById("nav-menu");
burger === null || burger === void 0 ? void 0 : burger.addEventListener("click", () => {
    menu === null || menu === void 0 ? void 0 : menu.classList.toggle("hidden");
});
