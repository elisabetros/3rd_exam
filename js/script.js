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
        console.log("project before if", matchedProject);
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
  let string =
    "You have successfully signed up as a volunteer in the " +
    matchedProject.title +
    " project";
  showAlertModal(string);
}

// projects added

const texts = [
  {
    id: 11,
    title: "Help to clean Bognæs Skov (Zealand)",
    text:
      "<h3>Where:</h3> Bognæs Skov 4300 Holbæk <br><h3>When:</h3> 12/05/2019  (You will get email with detailed information after you sign up) <br><h3>Why:</h3> Bognæs skov is located at half-island Tuse Næs, with an area of 94 ha of wild forest. Help us to improve the area, by cleaning the forest and fixing amenities and get to know Danish nature in its wild appearance!",
    img: "img/tuse.png"
  },
  {
    id: 12,
    title: "Replant the Planet (Capital region)",
    text:
      "Gribskov is one of Denmark's largest forests with approximately 5500ha. It is the last remains of the vast wilderness, which in past covered the whole of North Sealand. <br><h3>Where: </h3>Gribskov forest, 3400 Hillerød <br><h3>When:</h3> 15/04/2019 (You will get email with detailed information after you sign up)<br><h3> Why:</h3> Gribskov is not only an essential historical inheritage, but also a biggest forest in North Zealand. Our purpose is to both save its origins and to improve the climate, by planting new trees. At this event you will be able to make a difference and to learn more about Danish fauna and Danish history!",
    img: "img/gribskov.png"
  },
  {
    id: 14,
    title: "Spend a day with wild birds (South Jutland)",
    text:
      "<h3>Where: </h3>Okholmvej 56760 Ribe <br><h3>When: </h3>10/05/2019 (You will get email with detailed information after you sign up) <br><h3>Why:</h3> Mandø is located in the middle of the Wadden Sea with the most unique concentrations of migratory birds. Help us to save birds from disappearing  by cleaning the area and install new birds houses. In this event you will get a perfect opportunity not only to make a change, but watch birds and get to know a lot about Danish fauna!",
    img: "img/mandoe.png"
  },
  {
    id: 13,
    title: "Clean beautiful beaches (North Jutland)",
    text:
      "Kandestederne is a wide beach with high dunes, where you can enjoy the view over the North Sea and the open plains. <br><h3>Where: </h3>Kandestederne/Skiveren 9990 Skagen <br><h3>When:</h3> 10/04/2019 (You will get email with detailed information after you sign up) <br><h3> Why: </h3>Skagen beaches are one of the biggest attraction for both Danish citizens and tourists. Help us to kick start outdoor season by cleaning a very picturesque area of Kandestederne/Skiveren. At this event you will be able not only to improve the climate, but make many beautiful pictures of a wild nature!",
    img: "img/beach.png"
  },
  {
    id: 15,
    title: "Make a difference at Bølling Sø area (Central Jutland)",
    text:
      "<h3>Where:</h3>  Kragelundvej 6a 7442 Engesvang <br><h3> When:</h3> 10/06/2019  (You will get email with detailed information after you sign up)<br><h3>Why:</h3>  Bølling Sø has both historical and environmental meaning. Help us to maintain its beauty by cleaning, planting trees or fixing amenities and get to watch birds, fish, enjoy the nature and also make an input in a Danish environment!",
    img: "img/boling.png"
  }
];

function openReadMore(id) {
  // beVolunteerModal.id = id;
  console.log("id", id);
  for (let i = 0; i < texts.length; i++) {
    if (id === texts[i].id) {
      titleProject.textContent = texts[i].title;
      textProject.innerHTML = texts[i].text;
      imgProject.style.backgroundImage = "url(" + texts[i].img + ")";
      //   imgProject.style.background =
      //     "linear-gradient(rgba(255, 0, 0, 0.45), rgba(255, 0, 0, 0.45)), url(" +
      //     texts[i].img +
      //     ");";
    }
  }
  let beVolunteerModal = document.querySelector(".beVolunteerModal");

  beVolunteerModal.addEventListener("click", function() {
    parent.id = id;
    console.log("parentid", id);
    addProject(id);
  });
}

let titleProject = document.querySelector(".titleProject");
let textProject = document.querySelector(".textProject");
let imgProject = document.querySelector(".imgProject");
let modalReadMore = document.querySelector(".modal-box");
let btnReadMore = document.querySelectorAll(".readMore");
// var spanReadMore = document.getElementsByClassName("closeModal")[0];

btnReadMore.forEach(function(e) {
  e.addEventListener("click", function() {
    modalReadMore.style.display = "block";
  });
});

// spanReadMore.addEventListener("click", function() {
//   modalReadMore.style.display = "none";
// // });

window.onclick = function(event) {
  if (event.target == modalReadMore) {
    modalReadMore.style.display = "none";
  }
};
