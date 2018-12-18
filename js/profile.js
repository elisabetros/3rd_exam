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
  } else if (b.date > a.date) {
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

//Edit user settings

let editNameIcon = document.querySelector("#nameEdit");
let saveNameIcon = document.querySelector("#saveEditName");
editNameIcon.addEventListener("click", function() {
  document.querySelector("#profileName").focus();
  editNameIcon.style.display = "none";
  saveNameIcon.style.display = "inline-block";
});

saveNameIcon.addEventListener("click", function() {
  let newName = document.querySelector("#profileName").textContent;
  let name = user.name;
  if (newName !== name) {
    let newUserName = {
      name: newName
    };

    updateUserInformation(newUserName);
    user.name = newName;
    sessionStorage.setItem("user", JSON.stringify(user));
  }
  editNameIcon.style.display = "inline-block";
  saveNameIcon.style.display = "none";
});

let editEmail = document.querySelector("#emailEdit");
let saveEmail = document.querySelector("#saveEditEmail");
editEmail.addEventListener("click", function() {
  document.querySelector("#profileEmail").focus();
  editEmail.style.display = "none";
  saveEmail.style.display = "inline-block";
});

saveEmail.addEventListener("click", function() {
  let newEmail = document.querySelector("#profileEmail").textContent;
  let email = user.email;
  if (newEmail !== email) {
    let newUserEmail = {
      email: newEmail
    };
    updateUserInformation(newUserEmail);
    user.email = newEmail;
    sessionStorage.setItem("user", JSON.stringify(user));
  }
  editEmail.style.display = "inline-block";
  saveEmail.style.display = "none";
});

let editPhone = document.querySelector("#telEdit");
let savePhone = document.querySelector("#saveEditTel");

editPhone.addEventListener("click", function() {
  document.querySelector("#profileTel").focus();
  editPhone.style.display = "none";
  savePhone.style.display = "inline-block";
});

savePhone.addEventListener("click", function() {
  let newTel = document.querySelector("#profileTel").textContent;
  let tel = user.phonenumber;
  if (newTel !== tel) {
    let newUserTel = {
      phonenumber: newTel
    };
    updateUserInformation(newUserTel);
    user.phonenumber = newTel;
    sessionStorage.setItem("user", JSON.stringify(user));
  }
  editPhone.style.display = "inline-block";
  savePhone.style.display = "none";
});

function updateUserInformation(content) {
  // Put request
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/users/" + user.id, {
      method: "PUT",
      body: JSON.stringify(content),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(function(data) {
        resolve(data);
        console.log("updated user", data);
      });
  });
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

  if (userData.projects.length > 0) {
    let usersProjects = userData.projects;
    usersProjects.forEach(project => {
      let clone = template.cloneNode(true);
      clone.querySelector("#projectName").textContent = project.title;
      clone.querySelector("#projectDate").textContent = project.date;
      clone.querySelector(".removeBtn").dataset.id = project.id;
      clone
        .querySelector(".removeBtn")
        .addEventListener("click", removeProject);
      projectSection.appendChild(clone);
    });
  } else {
    document.querySelector("#youSignedUp").textContent =
      "You are not signed up for any project yet";
  }
}

function fillInData(user) {
  let userName = document.querySelector("#profileName");
  let userEmail = document.querySelector("#profileEmail");
  let userPhone = document.querySelector("#profileTel");
  userName.textContent = user.name;
  userEmail.textContent = user.email;
  userPhone.textContent = "tel:" + user.phonenumber;
}

window.addEventListener("scroll", function(e) {
  // var header = document.getElementById("nav");
  if (scrollY >= 100) {
    header.style.backgroundColor = "rgba(0,0,0,.7)";
  } else {
    header.style.backgroundColor = "rgba(0,0,0,0)";
  }
});

function fetchVolunteerById() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/volunteer/" + user.id)
      .then(response => response.json())
      .then(function(data) {
        console.log("onevolunteer", data);
        resolve(data);
      });
  });
}

async function removeProject(e) {
  console.log(e);
  const volunteer = await fetchVolunteerById();
  const projectID = e.target.dataset.id;
  console.log("projectID", projectID);

  volunteer.projects = volunteer.projects.filter(p => p.id != projectID);
  console.log("volunteer.projects", volunteer.projects);
  const user = {
    projects: volunteer.projects
  };
  updateProjectList(user, volunteer.id);
}

// volunteer.projects.find(project => {
//   if (project.userID === user.id) {
//     console.log(volunteer);
//     const updatedProjects = volunteer.projects.filter(p => {
//       if (p.id != projectID) {
//         return true;
//       }
//     });

//       updateProjectList(updatedProjects, volunteer.id);
//     }
//   });
//   // let string = "You have removed yourself from the project, ";
//   // showAlertModal(string);
// }

function updateProjectList(content, id) {
  console.log(content);
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/volunteer/" + id, {
      method: "PUT",
      body: JSON.stringify(content),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(function(data) {
        console.log("updated user", data);
        resolve(data);
      });
  });
}
// r
//

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
  fillInData(user);
  // removeBtn.forEach(btn => {
  //   btn.addEventListener("click", function() {
  //     console.log(btn);
  //     // removeProject(name);
  //   });
  // });

  // editBtn.addEventListener("click", e => {
  //   e.preventDefault();
  //   // console.log("edit click");
  //   changeToInput();
  // });
  // fillTemplateDonations(thisUserDonations);
}
