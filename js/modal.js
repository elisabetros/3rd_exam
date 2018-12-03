"user strict";

window.addEventListener("load", init);

const signInModal = document.querySelector("#signIn");
const signUpModal = document.querySelector("#signUp");
let link = document.querySelectorAll(".signIn");
let signUpLink = document.querySelector(".signUp");
let span = document.querySelectorAll(".close");
let signUpBtn = document.querySelector("#signUpBtn");

function init() {
  link.forEach(singleLink => {
    singleLink.addEventListener("click", openModal);
  });
  span.forEach(singleSpan => {
    singleSpan.addEventListener("click", e => {
      e.target.parentElement.parentElement.style.display = "none";
    });
  });

  function openModal() {
    signInModal.style.display = "block";
    signUpLink.addEventListener("click", opensignUpModal);
  }
  function opensignUpModal() {
    signUpModal.style.display = "block";
    signInModal.style.display = "none";
  }
}
