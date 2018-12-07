"user strict";

window.addEventListener("load", init);

const signInModal = document.querySelector("#signIn");
const signUpModal = document.querySelector("#signUp");
// const formModal = document.querySelector("#formModal");
const projectVolBtn = document.querySelectorAll(".beVolunteer");
const donateBtn = document.querySelector("donate");
const volunteerBtn = document.querySelector(".volunteer");
let link = document.querySelectorAll(".signIn");
let signUpLink = document.querySelector(".signUp");
let span = document.querySelectorAll(".close");
let signUpBtn = document.querySelector("#signUpBtn");

function init() {
  // donateBtn.addEventListener("click", openFormModal);
  // volunteerBtn.addEventListener("click", openFormModal);
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
    signUpLink.addEventListener("click", opensignUpModal);
  }
  function opensignUpModal() {
    signUpModal.style.display = "block";
    signInModal.style.display = "none";
  }
}
function openFormModal() {
  openFormModal.style.display = "block;";
}

//modal for Read more

const texts = [
  {
    id: 1,
    title: "Help to clean Bognæs Skov (Zealand)",
    text:
      "<h3>Where:</h3> Bognæs Skov 4300 Holbæk <br><h3>When:</h3> 12/05/2019  (You will get email with detailed information after you sign up) <br><h3>Why:</h3> Bognæs skov is located at half-island Tuse Næs, with an area of 94 ha of wild forest. Help us to improve the area, by cleaning the forest and fixing amenities and get to know Danish nature in its wild appearance!",
    img: "img/tuse.png"
  },
  {
    id: 2,
    title: "Replant the Planet (Capital region)",
    text:
      "Gribskov is one of Denmark's largest forests with approximately 5500ha. It is the last remains of the vast wilderness, which in past covered the whole of North Sealand. <br><h3>Where: </h3>Gribskov forest, 3400 Hillerød <br><h3>When:</h3> 15/04/2019 (You will get email with detailed information after you sign up)<br><h3> Why:</h3> Gribskov is not only an essential historical inheritage, but also a biggest forest in North Zealand. Our purpose is to both save its origins and to improve the climate, by planting new trees. At this event you will be able to make a difference and to learn more about Danish fauna and Danish history!",
    img: "img/gribskov.png"
  },
  {
    id: 4,
    title: "Spend a day with wild birds (South Jutland)",
    text:
      "<h3>Where: </h3>Okholmvej 56760 Ribe <br><h3>When: </h3>10/05/2019 (You will get email with detailed information after you sign up) <br><h3>Why:</h3> Mandø is located in the middle of the Wadden Sea with the most unique concentrations of migratory birds. Help us to save birds from disappearing  by cleaning the area and install new birds houses. In this event you will get a perfect opportunity not only to make a change, but watch birds and get to know a lot about Danish fauna!",
    img: "img/mandoe.png"
  },
  {
    id: 3,
    title: "Clean beautiful beaches (North Jutland)",
    text:
      "Kandestederne is a wide beach with high dunes, where you can enjoy the view over the North Sea and the open plains. <br><h3>Where: </h3>Kandestederne/Skiveren 9990 Skagen <br><h3>When:</h3> 10/04/2019 (You will get email with detailed information after you sign up) <br><h3> Why: </h3>Skagen beaches are one of the biggest attraction for both Danish citizens and tourists. Help us to kick start outdoor season by cleaning a very picturesque area of Kandestederne/Skiveren. At this event you will be able not only to improve the climate, but make many beautiful pictures of a wild nature!",
    img: "img/beach.png"
  },
  {
    id: 5,
    title: "Make a difference at Bølling Sø area (Central Jutland)",
    text:
      "<h3>Where:</h3>  Kragelundvej 6a 7442 Engesvang <br><h3> When:</h3> 10/06/2019  (You will get email with detailed information after you sign up)<br><h3>Why:</h3>  Bølling Sø has both historical and environmental meaning. Help us to maintain its beauty by cleaning, planting trees or fixing amenities and get to watch birds, fish, enjoy the nature and also make an input in a Danish environment!",
    img: "img/boling.png"
  }
];

function openReadMore(id) {
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

//Modal for Read more ends

//Volunteer projects

// function addProject(id) {
//   console.log("id", id);
// }
