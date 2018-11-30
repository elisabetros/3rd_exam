let userName;
const signInModal = document.querySelector("#signIn");
const signUpModal = document.querySelector("#signUp");
let link = document.querySelectorAll(".signIn");
let signUpLink = document.querySelector(".signUp");
let span = document.querySelectorAll(".close");
let form = document.querySelector("#signUpForm");
// let spanOut = document.querySelector(".closeOut");
window.addEventListener("load", checkLogin);

link.forEach(singleLink => {
  singleLink.addEventListener("click", openModal);
});
span.forEach(singleSpan => {
  singleSpan.addEventListener("click", e => {
    console.log(e);
    e.target.parentElement.parentElement.style.display = "none";
  });
});

function openModal() {
  console.log("modal opened");
  signInModal.style.display = "block";
  signUpLink.addEventListener("click", opensignUpModal);
}
function opensignUpModal() {
  signUpModal.style.display = "block";
  signInModal.style.display = "none";
}

// window.addEventListener("click",  if (event.target == modal) {closeModal()})
// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     signInModal.style.display = "none";
//   }
// };

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
  //   modal.querySelector(".modalOut").style.display = "none";
  //   modal.querySelector(".modalIn").style.display = "inital";
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

//Signup
//read if all values are correct
//if correct then validate form
//When submit is pressed post to API
//sign user in and reload to user page

function checkNameVal() {
  let name = document.querySelector(".username");
  if (name.value === "") {
    name.style.color = "red";
  } else {
    if (name.checkValidity()) {
      name.style.border = "1px solid green";
    } else {
      name.style.border = "1px solid red";
    }
  }
}

function checkGenVal() {
  let gender = document.querySelector(".gender");
  if (gender.value === "") {
    gender.style.color = "red";
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
function checkRegVal() {
  let region = document.querySelector(".region");
  if (region.value === "") {
    region.style.color = "red";
  } else {
    if (region.checkValidity()) {
      region.style.border = "1px solid green";
    } else {
      region.style.border = "1px solid red";
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
  // let label = input.nextElementSibling;
  // console.log(label);
  input.style.color = "#1b1464";
}

function checkForm() {
  let validity = form.checkValidity();
  console.log("Validity", validity);
}
