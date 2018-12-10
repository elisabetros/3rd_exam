"use strict";

window.addEventListener("load", init);

let linkOut = document.querySelectorAll(".logOut");
let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io";
let userData;

let area;

let user = JSON.parse(sessionStorage.getItem("user"));

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

function matchDonations(user, donationsData) {
  let totalAmount = [];
  for (let i = 0; i < donationsData.length; i++) {
    if (user.id == donationsData[i].id) {
      console.log("user has donations!", donationsData[i].amount);
      let amount = donationsData[i].amount;
      totalAmount.push(amount);
    }
  }
  console.log("total", totalAmount);
  return totalAmount;
}

function matchVolunteers(user, volunteeringData) {
  for (let i = 0; i < volunteeringData.length; i++) {
    if (user.id == volunteeringData[i].id) {
      console.log("you are volunteer", volunteeringData[i].area);
      area = volunteeringData[i].area;
      return;
    }
  }
}
function showUser(data) {
  //show profile information
  // when edit buttoned is press change to input field
  // make put request
  console.log(data);
}
function showDonations(totalDonations) {
  let amountInput = document.querySelector(".donationsMade");
  let amount = 0;
  for (let i = 0; i < totalDonations.length; i++) {
    amount = amount + Number(totalDonations[i]);
  }
  amountInput.innerHTML = amount + "dkk";
}
function showVolunteering(volunteeringData) {
  let areaAssigned = document.querySelector("#area");
  areaAssigned.innerHTML = area;
}

function logOut() {
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
}
let template = document.querySelector("template").content;
let projectSection = document.querySelector("#projectSection");
let projectName = document.querySelector("#projectName");

function fillInTemplateProjects() {
  let project = JSON.parse(sessionStorage.getItem("project"));
  let clone = template.cloneNode(true);
  console.log("project title", project.title);
  clone.querySelector("#projectName").textContent = project.title;
  clone.querySelector("#projectDate").textContent = project.date;

  projectSection.appendChild(clone);
}

async function init() {
  fillInTemplateProjects();
  const donationsData = await fetchDonations();
  const volunteeringData = await fetchVolunteer();
  const totalDonations = matchDonations(user, donationsData);
  matchVolunteers(user, volunteeringData);
  showDonations(totalDonations);
  showVolunteering(area);
  linkOut.forEach(link => {
    link.addEventListener("click", logOut);
  });
}
