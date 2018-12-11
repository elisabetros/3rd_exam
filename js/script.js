"use strict";

window.addEventListener("load", init);

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
function slideModal() {
  //NOT WORKING
  let webAlert = document.querySelector(".slide-modal");

  setTimeout(() => {
    webAlert.classList.add("slide");
  });

  setTimeout(function() {
    webAlert.classList.remove("slide");
  }, 1000);
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
      let projectsForthisVolunteer = volunteers[i].projects;
      let found = projectsForthisVolunteer.find(function(project) {
        if (project.id === matchedProject.id) {
          return true;
        }
      });
      console.log("found", found);
      if (found) {
        console.log("already added, do not add twice");
        return;
      }
      console.log("project does not exists, add to api");
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
  // slideModal();
}

// projects added
