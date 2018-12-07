"user strict";

window.addEventListener("load", init);

// let userName;
let form = document.querySelector("#signUpForm");
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
    console.log("someone is signed in!");
    // console.log("user logged in is", userData);
    link.forEach(singleLink => {
      singleLink.innerText = "Log Out";
      singleLink.addEventListener("click", logOut);
    });
  } else {
    showSignUp(userData);
  }
}

function isLoggedIn() {
  // const loggedIn = sessionStorage.getItem("loggedin");
  let user = JSON.parse(sessionStorage.getItem("user"));
  console.log("You are logged in:", user);

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
      sessionStorage.setItem("user", JSON.stringify(user));
      alert("you are signed in!");
      // window.location.replace("profile.html?id=" + user.id);
    }
  });

  if (userName && userPassword) {
    // console.log(userName);
    doLogin(userID);
  } else {
    console.log("not a user");
    // showError();
  }
}

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
    if (gender.checkValidity()) {
      gender.style.border = "1px solid green";
    } else {
      gender.style.border = "1px solid red";
    }
  }
}
function checkAgeVal() {
  let age = document.querySelector(".age");
  if (age.value === "") {
    age.style.color = "red";
  } else {
    if (age.checkValidity()) {
      age.style.border = "1px solid green";
    } else {
      age.style.border = "1px solid red";
    }
  }
}
function checkEmailVal() {
  let email = document.querySelector(".email");
  if (email.value === "") {
    email.style.color = "red";
  } else {
    if (email.checkValidity()) {
      email.style.border = "1px solid green";
    } else {
      email.style.border = "1px solid red";
    }
  }
}
function checkTelVal() {
  let phonenumber = document.querySelector(".phonenumber");
  if (phonenumber.value === "") {
    phonenumber.style.color = "red";
  } else {
    if (phonenumber.checkValidity()) {
      phonenumber.style.border = "1px solid green";
    } else {
      phonenumber.style.border = "1px solid red";
    }
  }
}
function checkPassVal() {
  {
    let password = document.querySelector(".password");
    let secondPassword = document.querySelector(".passwordv");
    if (password.value === "") {
      region.style.color = "red";
    } else {
      if (password.checkValidity()) {
        password.style.border = "1px solid green";
      } else {
        password.style.border = "1px solid red";
      }
    }
    if (password.value === secondPassword.value) {
      secondPassword.style.border = "1px solid green";
    } else {
      secondPassword.style.border = "1px solid red";
    }
  }
}
function resetColor(input) {
  // NOT READY YET
  input.style.color = "#1b1464";
}

function checkForm() {
  let validity = form.checkValidity();
  console.log("Validity", validity);
  if (validity) {
    signUpBtn.removeAttribute("disabled");
  } else {
    signUpBtn.setAttribute("disabled", true);
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  fetch(endpoint + "/users")
    .then(response => response.json())
    .then(data => {
      const found = data.find(user => {
        if (user.name === form.elements.username.value) {
          // console.log("already a name!");
          alert("user already exist, choose another username");
          return true;
        }
      });
      if (!found) {
        createUser(
          form.elements.username.value,
          form.elements.gender.value,
          form.elements.age.value,
          form.elements.email.value,
          form.elements.phonenumber.value,
          form.elements.passwordv.value
        );
      }
    });
});

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
    });
}

// setTimeout(() => {
//   console.log(newUser.name);
//   // doLogin(newUser.name)
// }, 500);
// doLogin(newUser);

function openProfile() {
  if (sessionStorage.getItem("user")) {
    window.location.href = "profile.html";
  } else {
    showSignUp();
  }
}
