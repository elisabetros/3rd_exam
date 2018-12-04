"user strict";

window.addEventListener("load", init);

let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("id");
let link = document.querySelectorAll(".logOut");
let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io";

function fetchUsers() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/users/" + id)
      .then(response => response.json())
      .then(function(data) {
        resolve(data);
      });
  });
}

function fetchVolunteer() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/volunteer/")
      .then(response => response.json())
      .then(function(data) {
        resolve(data);
      });
  });
}

function fetchDonations() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/money/")
      .then(response => response.json())
      .then(function(data) {
        resolve(data);
      });
  });
}
function matchdonations(user, donation) {
  // loop through users
  // loop trhough donations
  showDonations();
}
function matchVolunteers(user, volunteer) {
  // loop through users
  // loop trhough volunteers
  showVolunteering();
}
function showUser(data) {
  //show profile information
  // when edit buttoned is press change to input field
  // make put request
  console.log(data);
}
function showDonations(donationsData) {
  //   console.log(donationsData);
}
function showVolunteering(volunteeringData) {}

function logOut() {
  window.location.replace("index.html");
  sessionStorage.setItem("loggedin", "false");
}

async function init() {
  link.forEach(singleLink => {
    singleLink.addEventListener("click", logOut);
  });
  const userData = await fetchUsers();
  const donationsData = await fetchDonations();
  const volunteeringData = await fetchVolunteer();
  matchdonations(userData, donationsData);
  matchVolunteers(userData, volunteeringData);
  showUser(userData);
}
