"user strict";

window.addEventListener("load", init);

const signInModal = document.querySelector("#signIn");
const formModal = document.querySelector("#formModal");
const volunteerForm = document.querySelector("#volunteerForm");
const donateForm = document.querySelector("#donateForm");
const notSignedInForm = document.querySelector("#notSignedIn");
const securePayForm = document.querySelector("#securePayment");
const projectVolBtn = document.querySelectorAll(".beVolunteer");
const donateBtn = document.querySelector(".donateBtn");
const volunteerBtn = document.querySelector(".volunteerBtn");
let signInlink = document.querySelectorAll(".signIn");
let signUpLink = document.querySelector(".signUpLink");
let span = document.querySelectorAll(".close");
let signUpBtn = document.querySelector("#signUpBtn");

let signUpForm = document.querySelector("#signUpForm");
let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io";
let logOutLink = document.querySelectorAll(".logOut");

let svgs = document.querySelectorAll(".animate");

function createObserver() {
  let observer;
  observer = new IntersectionObserver(entries => {
    // console.log(entries);
    entries.forEach(entry => {
      let path = entry.target.querySelectorAll(".path");
      if (entry.intersectionRatio > 0) {
        // console.log("in view");
        path.forEach(singlePath => {
          singlePath.classList.add("draw");
        });
        // entry.target.style.display = "block";
      } else {
        // console.log("out of view");
        path.forEach(singlePath => {
          singlePath.classList.remove("draw");
        });
        // entry.target.style.display = "none";
      }
    });
  });
  svgs.forEach(svg => {
    observer.observe(svg);
  });
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
function checkLogin() {
  if (isLoggedIn()) {
    signInlink.forEach(singleLink => {
      singleLink.style.display = "none";
    });
    logOutLink.forEach(logLink => {
      logLink.style.display = "block";
    });
    // console.log("user logged in is", userData);
  } else {
    logOutLink.forEach(logLink => {
      logLink.style.display = "none";
    });
  }
}

function isLoggedIn() {
  let user = JSON.parse(sessionStorage.getItem("user"));
  console.log("You are logged in:", user);
  return user;
}

function showSignUp(userData) {
  document.querySelector("#signInBtn").addEventListener("click", e => {
    e.preventDefault();
    checkUser(userData);
  });
}

function checkUser(userData) {
  let emailInput = document.querySelector("#email").value;
  let passwordInput = document.querySelector("#password").value;
  let exist = false;
  userData.forEach(user => {
    if (emailInput === user.email && passwordInput === user.password) {
      // let userName = user.name;
      exist = true;
      doLogIn(user);
    }
  });
  if (!exist) {
    showAlertModal("wrong username or password");
    // console.log("login");
  }
}

function doLogIn(user) {
  // console.log("click");
  sessionStorage.setItem("user", JSON.stringify(user));
  signInModal.style.display = "none";
  showAlertModal("Your are now signed In!");
  signInlink.forEach(singleLink => {
    singleLink.style.display = "none";
  });
  logOutLink.forEach(logLink => {
    logLink.style.display = "block";
  });
}

function logOut() {
  signInlink.forEach(singleLink => {
    singleLink.style.display = "block";
  });
  logOutLink.forEach(logLink => {
    logLink.style.display = "none";
  });
  showAlertModal("You have successfully logged out");
  setTimeout(function() {
    sessionStorage.removeItem("user");
    window.location.href = "index.html";
  }, 1000);
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
      item.style.borderBottom = "1px solid green";
    } else {
      item.style.borderBottom = "1px solid red";
    }
  }
}
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
      showAlertModal("user already exist, choose another username");
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
      form.password.value
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
      signInModal.style.display = "none";
      setTimeout(() => {
        logInNewUser(newUser);
      }, 1000);
    });
}
async function logInNewUser(newUser) {
  const userData = await fetchUsers();
  userData.find(user => {
    if (user.name === newUser.name) {
      doLogIn(user);
    }
  });
}

function openProfile() {
  if (sessionStorage.getItem("user")) {
    window.location.href = "profile.html";
  } else {
    showSignUp();
  }
}

window.addEventListener("scroll", function(e) {
  // var header = document.getElementById("nav");
  if (scrollY >= 700) {
    header.style.backgroundColor = "rgba(0,0,0,.7)";
    dropdown.style.backgroundColor = "rgba(0,0,0,.7)";
  } else {
    header.style.backgroundColor = "rgba(0,0,0,0)";
    dropdown.style.backgroundColor = "rgba(0,0,0,0)";
  }
});

function openModal() {
  signInModal.style.display = "block";
  signUpLink.addEventListener("click", moveLeft);
}
function moveLeft() {
  console.log("click");
  document.querySelector(".absolute").classList.add("move");
  document.querySelector(".notMember").style.display = "none";
  document.querySelector(".alreadyMember").style.display = "block";
  document.querySelector(".signLink").addEventListener("click", moveRight);
}
function moveRight() {
  document.querySelector(".absolute").classList.remove("move");
  document.querySelector(".notMember").style.display = "block";
  document.querySelector(".alreadyMgit ember").style.display = "none";
}

function openFormModal(type) {
  console.log(type);
  formModal.style.display = "block";
  if (type === "donateForm") {
    document.querySelector(".formTitle").textContent = "Donate";
    formModal.querySelector(".modalImage").style.backgroundImage =
      "url(../img/gribskov.png)";
  } else {
    document.querySelector(".formTitle").textContent = "Volunteer";
    formModal.querySelector(".modalImage").style.backgroundImage =
      "url(../img/kikkert.jpg)";
  }
  document.querySelector(".notSignedSignIn").addEventListener("click", e => {
    openModal();
    notSignedInForm.style.display = "none";
  });
  if (!isLoggedIn()) {
    console.log("no one is logged in");
    formModal.querySelectorAll("form").forEach(form => {
      form.style.display = "none";
    });
    notSignedInForm.style.display = "grid";
    notSignedInForm.addEventListener("submit", e => {
      e.preventDefault();
      checkIfAlreadyUser(notSignedInForm.elements);
      notSignedInForm.style.display = "none";
      showForm(type, notSignedInForm.elements);
    });
  } else {
    showForm(type);
  }
}

function showForm(type) {
  console.log("show", type);
  formModal.querySelectorAll("form").forEach(form => {
    form.style.display = "none";
  });
  document.querySelector("#" + type).style.display = "block";
  document.querySelector("#" + type).addEventListener("submit", e => {
    e.preventDefault();
    // console.log("click");
    if (type === "donateForm") {
      // console.log(donateForm.elements);
      goToPayment(donateForm.elements);
    } else {
      makeNewVolunteer(volunteerForm.elements);
    }
  });
}

function goToPayment(formElements) {
  formModal.querySelectorAll("form").forEach(form => {
    form.style.display = "none";
  });
  securePayForm.style.display = "grid";
  securePayForm.addEventListener("submit", e => {
    e.preventDefault();
    // console.log(securePayForm.elements);
    makeNewDonation(formElements);
  });
  // securePayForm;
}
async function makeNewDonation(formElements) {
  console.log(formElements.donation.value);
  // let donations = await fetchDonations();
  let user = JSON.parse(sessionStorage.getItem("user"));
  let newDonation = {
    userID: user.id,
    amount: formElements.donation.value
  };
  console.log("new donation:", newDonation);
  let newCreatedDonation = await addNewDonation(newDonation);
  console.log("new created", newCreatedDonation);
  formModal.style.display = "none";
  let string = "You have successfully donated " + newDonation.amount + " dkk";
  showAlertModal(string);
}
async function makeNewVolunteer(formElements) {
  let volunteers = await fetchVolunteer();
  let user = JSON.parse(sessionStorage.getItem("user"));
  let found = volunteers.find(volunteer => {
    if (volunteer.id === user.id) {
      // Put request
      let changedVolunteer = {
        userID: user.id,
        date: new Date(),
        area: formElements.region.value,
        projects: []
      };
      return true;
    }
  });
  let newVolunteer = {
    userID: user.id,
    date: new Date(),
    area: formElements.region.value
    // projects: []
  };
  if (!found) {
    console.log("newVolunteer", newVolunteer);
    let newCreatedVolunteer = await addNewVolunteer(newVolunteer);
    console.log("newCreated", newCreatedVolunteer);
    let string =
      "Thank you for signing up as a volunteer in the " +
      newVolunteer.area +
      " area, we will contact you with projects via email";
    showAlertModal(string);
    form.formModal.style.display = "none";
  } else {
    console.log("updatedVolunteer", newVolunteer);
    let updatedVolunteer = await changeVolunteer(newVolunteer);
    console.log("updated", updatedVolunteer);
    string =
      "You have successfully changed the are you want to volunteer in to " +
      newVolunteer.area;
    showAlertModal(string);
  }
}
function changeVolunteer(newVolunteer) {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/volunteer/" + newVolunteer.userID, {
      method: "PUT",
      body: JSON.stringify(newVolunteer),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(function(data) {
        resolve(data);
        console.log(data);
      });
  });
}

function addNewDonation(newDonation) {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/money", {
      method: "POST",
      body: JSON.stringify(newDonation),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(function(data) {
        resolve(data);
      });
  });
}

function showAlertModal(text) {
  // console.log("yas I wil show");
  let webAlert = document.querySelector(".slide-modal");
  webAlert.classList.remove("slide");
  webAlert.querySelector("p").innerText = text;
  setTimeout(function() {
    webAlert.classList.add("slide");
  }, 3000);
}

async function init() {
  const userData = await fetchUsers();
  showSignUp(userData);
  checkLogin();
  logOutLink.forEach(logLink => {
    logLink.addEventListener("click", logOut);
  });
  createObserver();
  donateBtn.addEventListener("click", function() {
    openFormModal("donateForm");
  });
  volunteerBtn.addEventListener("click", function() {
    openFormModal("volunteerForm");
  });
  signInlink.forEach(singleLink => {
    singleLink.addEventListener("click", openModal);
  });
  span.forEach(singleSpan => {
    singleSpan.addEventListener("click", e => {
      e.target.parentElement.parentElement.style.display = "none";
    });
  });
}
