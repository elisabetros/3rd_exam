let userName;
let modal = document.querySelector("#popUp");
let link = document.querySelectorAll(".signIn");
let span = document.getElementsByClassName("close")[0];
window.addEventListener("load", checkLogin);

link.forEach(singleLink => {
  singleLink.addEventListener("click", openModal);
});

span.addEventListener("click", closeModal);

function openModal() {
  modal.style.display = "block";
  //   if (isLoggedIn) {
  //    } else {

  //   }
}
function closeModal() {
  modal.style.display = "none";
}

// window.addEventListener("click",  if (event.target == modal) {closeModal()})
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

////////LOGIN CHECK///////
function checkLogin() {
  if (isLoggedIn()) {
    console.log("someone is signed in!");
    link.forEach(singleLink => {
      singleLink.innerText = "Log Out";
      singleLink.addEventListener("click", logOut);
    });
  } else {
    showSignUp();
  }
}

function isLoggedIn() {
  const loggedIn = sessionStorage.getItem("loggedin") === "true";
  console.log("You are logged in:", loggedIn);
  return loggedIn;
}

function showSignUp() {
  console.log("noone is signed in");
  link.forEach(singleLink => {
    singleLink.innerText = "Sign In";
  });
  //   modal.querySelector(".modelOut").style.display = "none";
  //   modal.querySelector(".modelIn").style.display = "inital";
  document.querySelector("#signIn").addEventListener("click", e => {
    e.preventDefault();
    checkUser();
  });
}
function checkUser() {
  let userInput = document.querySelector("#name").value;
  userName = null;
  fetch(endpoint + "users")
    .then(response => response.json())
    .then(data => {
      data.forEach(user => {
        console.log(user.name);
        if (userInput === user.name) {
          userName = user.name;
        }
      });
      if (userName) {
        console.log(userName);
        doLogin();
      } else {
        console.log("not a user");
        // showError();
      }
    });
}
function showError() {
  console.log("not a user");
}
function doLogin() {
  window.location.replace("signintest.html");
  // remember login
  console.log("user logged in!");
  sessionStorage.setItem("loggedin", "true");
  link.forEach(singleLink => {
    singleLink.innerText = "Log Out";
    singleLink.addEventListener("click", logOut);
  });
}
function logOut() {
  sessionStorage.setItem("loggedin", "false");
  window.location.replace("index.html");
  checkLogin();
}
