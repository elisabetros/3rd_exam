"user strict";

window.addEventListener("load", init);

// let userName;
let signUpForm = document.querySelector("#signUpForm");
let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io";

//MENU
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

//MENU ends

async function init() {
  const userData = await fetchUsers();
  // checkLogin(userData);
  showSignUp(userData);
  checkLogin();
  // form.addEventListener("submit");
}

function fetchUsers() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/users")
      .then(response => response.json())
      .then(function(data) {
        resolve(data);
      });
  });
}

////////LOGIN CHECK///////
function checkLogin(userData) {
  if (isLoggedIn()) {
    // console.log("someone is signed in!");
    link.forEach(singleLink => {
      singleLink.innerText = "Log Out";
      singleLink.addEventListener("click", logOut);
    });
    // console.log("user logged in is", userData);
  }
}

function isLoggedIn() {
  // const loggedIn = sessionStorage.getItem("loggedin");
  let user = JSON.parse(sessionStorage.getItem("user"));
  console.log("You are logged in:", user);
  return user;
}

// function isLoggedIn() {
//   const loggedIn = sessionStorage.getItem("loggedin") === "true";
//   console.log("You are logged in:", loggedIn);
//   return loggedIn;
// }

function showSignUp(userData) {
  // console.log("noone is signed in");
  link.forEach(singleLink => {
    singleLink.innerText = "Sign In";
  });
  document.querySelector("#signInBtn").addEventListener("click", e => {
    e.preventDefault();
    checkUser(userData);
  });
}

function checkUser(userData) {
  let userInput = document.querySelector("#name").value;
  let passwordInput = document.querySelector("#password").value;
  let userName = null;
  let userPassword = null;
  let userID;
  userData.forEach(user => {
    if (userInput === user.name && passwordInput === user.password) {
      doLogIn(user);
    }
  });
}

function doLogIn(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
  alert("you are signed in!");
  link.forEach(singleLink => {
    singleLink.innerText = "Log Out";
    singleLink.addEventListener("click", logOut);
  });
}

// if (userName && userPassword) {
//   // console.log(userName);
//   doLogin(userID);
// } else {
//   console.log("not a user");
//   // showError();
// }

function logOut() {
  // sessionStorage.setItem("loggedin", false);
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
  // checkLogin();
}

//Signup
//read if all values are correct
//if correct then validate form
//When submit is pressed post to API
//sign user in and reload to user page

function checkInput(inputClass) {
  let item = document.querySelector("." + inputClass);
  if (item.value === "") {
    item.style.color = "red";
  } else {
    if (item.checkValidity()) {
      item.style.border = "1px solid green";
    } else {
      item.style.border = "1px solid red";
    }
  }
}
// function checkAgeVal() {
//   let age = document.querySelector(".age");
//   if (age.value === "") {
//     age.style.color = "red";
//   } else {
//     if (age.checkValidity()) {
//       age.style.border = "1px solid green";
//     } else {
//       age.style.border = "1px solid red";
//     }
//   }
// }
//
function resetColor(input) {
  // NOT READY YET
  input.style.color = "#1b1464";
}

function checkForm(formID) {
  let form = document.querySelector("#" + formID);
  let validity = form.checkValidity();
  console.log("Validity", validity);
  if (validity) {
    form.querySelector("input[type=submit]").removeAttribute("disabled");
  } else {
    form.querySelector("input[type=submit]").setAttribute("disabled", true);
  }
}

signUpForm.addEventListener("submit", e => {
  e.preventDefault();
  // console.log(form.elements);
  checkIfAlreadyUser(signUpForm.elements);
});

async function checkIfAlreadyUser(form) {
  // console.log(form);
  const userData = await fetchUsers();
  // console.log(userData);
  const found = userData.find(user => {
    if (user.name === form.username.value) {
      alert("user already exist, choose another username");
      return true;
    }
  });
  if (!found) {
    createUser(
      form.username.value,
      form.gender.value,
      form.age.value,
      form.email.value,
      form.phonenumber.value,
      form.passwordv.value
    );
  }
  // });
}

// Create empty user object
// fill it with information from form when submit button is pressed

// Get all information from form and store in newUser
// if it's a existing user Don't push
// Post to API
function createUser(
  formName,
  formGender,
  formAge,
  formEmail,
  formTel,
  formPass
) {
  if (formGender === "female") {
    formGender = "f";
  } else if (formGender === "male") {
    formGender = "m";
  } else {
    formGender = "o";
  }
  let y = formAge.split("-")[0];
  let m = formAge.split("-")[1];
  let d = formAge.split("-")[2];
  // console.log(y, m, d);
  let newUser = {
    createdAt: Date.now(),
    name: formName,
    gender: formGender,
    birthDate: d + "-" + m + "-" + y,
    email: formEmail,
    phonenumber: formTel,
    password: formPass
  };
  // console.log(newUser);

  fetch(endpoint + "/users", {
    method: "post",
    body: JSON.stringify(newUser),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(d => {
      console.log(d);
      signUpModal.style.display = "none";
      setTimeout(() => {
        doLogIn(newUser);
      }, 1000);
    });
}

function openProfile() {
  if (sessionStorage.getItem("user")) {
    window.location.href = "profile.html";
  } else {
    showSignUp();
  }
}
