"use strict";

window.addEventListener("load", init);

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

const projects = [
  {
    id: 11,
    title: "Help to clean Bognæs Skov",
    region: "Zealand",
    date: "12/05/2019"
  },
  {
    id: 12,
    title: "Replant the Planet",
    region: "Capital Region",
    date: "15/04/2019"
  },
  {
    id: 13,
    title: "Clean beautiful beaches",
    region: "North Jutland",
    date: "10/04/2019"
  },
  {
    id: 14,
    title: "Spend a day with wild birds",
    region: "South Jutland",
    date: "10/05/2019"
  },
  {
    id: 15,
    title: "Make a difference at Bølling Sø area",
    region: "Central Jutland",
    date: "10/06/2019"
  }
];

//projects to add
// function slideModal() {
//   //NOT WORKING
//
//   let projectName = document.querySelector(".spanProject");
//   // console.log("now I will show");
//   webAlert.classList.remove("slide");
//   let projectTitle = JSON.parse(sessionStorage.getItem("project"));
//   // console.log(projectTitle.title);
//   projectName.textContent = projectTitle.title;

//   setTimeout(function() {
//     webAlert.classList.add("slide");
//   }, 3000);
// }

function fetchVolunteer() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/volunteer/")
      .then(response => response.json())
      .then(function(data) {
        resolve(data);
      });
  });
}

function addNewVolunteer(newVolunteer) {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/volunteer", {
      method: "POST",
      body: JSON.stringify(newVolunteer),
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

function addNewProjectToJson(matchedProject) {
  console.log("matchedProject", matchedProject);

  const newData = {
    projects: matchedProject
  };
  let user = JSON.parse(sessionStorage.getItem("user"));
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/volunteer/" + user.id, {
      method: "PUT",
      body: JSON.stringify(newData),
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

function getProjectById(id) {
  for (let i = 0; i < projects.length; i++) {
    if (id === projects[i].id) {
      return projects[i];
    }
  }
}

async function addProject(id) {
  let matchedProject = getProjectById(id);
  let volunteers = await fetchVolunteer();
  console.log("volunteers", volunteers);
  let user = JSON.parse(sessionStorage.getItem("user"));

  console.log("sessionStorageUser", user.id);
  let exists = false;
  for (let i = 0; i < volunteers.length; i++) {
    if (volunteers[i].id === user.id) {
      exists = true;
      console.log("exists", volunteers[i]);
      volunteers[i].projects.push(matchedProject);
      let newDataPosted = await addNewProjectToJson(volunteers[i].projects);

      sessionStorage.setItem("project", JSON.stringify(matchedProject));
      console.log("newDataposted", newDataPosted);
    }
  }
  if (!exists) {
    let newVolunteer = {
      userID: user.id,
      date: new Date(),
      area: matchedProject.region,
      projects: [matchedProject]
    };
    console.log("newVolunteer", newVolunteer);
    let newCreatedVolunteer = await addNewVolunteer(newVolunteer);
    sessionStorage.setItem("project", JSON.stringify(matchedProject));
    console.log("newCreated", newCreatedVolunteer);
  }
  // sessionStorage.setItem("project", JSON.stringify(matchedProject));
  // fillInTemplateProjects(id);
  let string =
    "You have successfully signed up as a volunteer in the " +
    matchedProject.title +
    " project";
  showAlertModal(string);
}

// projects added
