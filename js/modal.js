"user strict";

window.addEventListener("load", init);

const signInModal = document.querySelector("#signIn");
const signUpModal = document.querySelector("#signUp");
const formModal = document.querySelector("#formModal");
const volunteerForm = document.querySelector("#volunteerForm");
const donateForm = document.querySelector("#donateForm");
const notSignedInForm = document.querySelector("#notSignedIn");
const securePayForm = document.querySelector("#securePayment");
const projectVolBtn = document.querySelectorAll(".beVolunteer");
const donateBtn = document.querySelector(".donateBtn");
const volunteerBtn = document.querySelector(".volunteerBtn");
let link = document.querySelectorAll(".signIn");
let signUpLink = document.querySelector(".signUpLink");
let span = document.querySelectorAll(".close");
let signUpBtn = document.querySelector("#signUpBtn");

function init() {
  donateBtn.addEventListener("click", function() {
    openFormModal("donateForm");
  });
  volunteerBtn.addEventListener("click", function() {
    openFormModal("volunteerForm");
  });
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
    document.querySelector(".alreadyMember").style.display = "none";
  }

  function openFormModal(type) {
    console.log(type);
    formModal.style.display = "block";
    if (type === "donateForm") {
      document.querySelector(".formTitle").textContent = "Donate";
    } else {
      document.querySelector(".formTitle").textContent = "Volunteer";
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

  // addeventlistener to buttton, post to API
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
    showAlertModal(
      "Thank you for signing up as a volunteer in this area, we will contact you with projects via email"
    );
    form.formModal.style.display = "none";
  } else {
    console.log("updatedVolunteer", newVolunteer);
    let updatedVolunteer = await changeVolunteer(newVolunteer);
    console.log("updated", updatedVolunteer);
    showAlertModal(
      "You have successfully changed the are you want to volunteer in"
    );
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

//modal for Read more

//Modal for Read more ends

//Volunteer projects

// function addProject(id) {
//   console.log("id", id);
// }

function showAlertModal(text) {
  // console.log("yas I wil show");
  let webAlert = document.querySelector(".slide-modal");
  webAlert.classList.remove("slide");
  webAlert.querySelector("p").innerText = text;
  setTimeout(function() {
    webAlert.classList.add("slide");
  }, 3000);
}
