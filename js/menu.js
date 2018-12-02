//Menu, show and hide
let menuOpen = false;
let menuIcon = document.querySelector(".menuIcon");
let menu = document.querySelector(".menu");
let bars = menuIcon.querySelectorAll("rect");
let menuLinks = document.querySelectorAll(".menu>ul>li");
menuIcon.addEventListener("click", toggleMenu);
menuLinks.forEach(link => {
  link.addEventListener("click", toggleMenu);
});
// Link clicked menu closed

function toggleMenu() {
  menuOpen = !menuOpen;
  bars[0].classList.toggle("rotateDown");
  bars[1].classList.toggle("fadeOut");
  bars[2].classList.toggle("rotateUp");
  menu.classList.toggle("hidden");
}
