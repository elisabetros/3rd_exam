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

function fetchUser() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/volunteer/" + user.id)
      .then(response => response.json())
      .then(function(userData) {
        resolve(userData);
      });
  });
}

function fetchDonations() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/money/")
      .then(response => response.json())
      .then(function(data) {
        resolve(data);
        console.log("donationsData", data);
      });
  });
}

function matchDonations(user, donationsData) {
  let totalAmount = [];
  let thisUserDonations = [];
  for (let i = 0; i < donationsData.length; i++) {
    if (user.id == donationsData[i].userID) {
      // console.log("user has donations!", donationsData[i].amount);
      let amount = donationsData[i].amount;
      totalAmount.push(amount);
      thisUserDonations.push(donationsData[i]);
      // console.log("donations data pushed", thisUserDonationS);
    }
  }
  // console.log("total", totalAmount);
  fillTemplateDonations(thisUserDonations);
  return totalAmount;
}

function fillTemplateDonations(thisUserDonations) {
  console.log("thisUserDonations", thisUserDonations);
  let templateDonation = document.querySelector("#donationsTemplate").content;
  let sortedDonations = thisUserDonations.sort(sortByDate);
  console.log("sortedDonations", sortedDonations);
  for (let i = 0; i < thisUserDonations.length; i++) {
    let clone = templateDonation.cloneNode(true);
    clone.querySelector("#amount").textContent =
      thisUserDonations[i].amount + "dkk";
    let dateFormatted = moment(thisUserDonations[i].date).format(
      "DD[/]MM[/]YYYY"
    );
    console.log("dateFormatted", dateFormatted);
    clone.querySelector("#dateDonation").textContent = dateFormatted;
    allDonations.appendChild(clone);
  }
}

function sortByDate(a, b) {
  if (b.date < a.date) {
    return -1;
  } else if (b.dateF > a.date) {
    return 1;
  } else {
    return 0;
  }
}

function matchVolunteers(user, volunteeringData) {
  for (let i = 0; i < volunteeringData.length; i++) {
    if (user.id == volunteeringData[i].id) {
      console.log("you are volunteer", volunteeringData[i].area);
      area = volunteeringData[i].area;
      return;
    } else {
      console.log("you are not a volunteer yet");
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
  console.log("total donations amount beginning of funtion", totalDonations);
  let amountInput = document.querySelector(".donationsMade");
  let amount = 0;

  for (let i = 0; i < totalDonations.length; i++) {
    amount = amount + Number(totalDonations[i]);

    console.log("Totaldonations", totalDonations[i]);
  }
  amountInput.innerHTML = amount + "dkk";
}
function showVolunteering(volunteeringData) {
  let areaAssigned = document.querySelector("#area");
  if (area) {
    areaAssigned.innerHTML = area;
  } else {
    document.querySelector("#signedUpArea").innerHTML =
      "you are not a volunteer yet";
  }
}

function logOut() {
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
}

function fillInTemplateProjects(userData) {
  let template = document.querySelector("#projectTemplate").content;

  if (userData.projects.length > 1) {
    let usersProjects = userData.projects;
    usersProjects.forEach(project => {
      let clone = template.cloneNode(true);
      clone.querySelector("#projectName").textContent = project.title;
      clone.querySelector("#projectDate").textContent = project.date;
      projectSection.appendChild(clone);
    });
  } else {
    document.querySelector("#youSignedUp").textContent =
      "You are not signed up for any project yet";
  }
}

async function init() {
  const donationsData = await fetchDonations();
  const volunteeringData = await fetchVolunteer();
  const totalDonations = matchDonations(user, donationsData);

  matchVolunteers(user, volunteeringData);
  showDonations(totalDonations);
  showVolunteering(area);
  let userData = await fetchUser();
  console.log("userData", userData);
  fillInTemplateProjects(userData);
  linkOut.forEach(link => {
    link.addEventListener("click", logOut);
  });
  // fillTemplateDonations(thisUserDonations);
}
