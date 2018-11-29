"use strict";
window.addEventListener("load", fetchEverything);
let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io/";
let userID = [];
let area = [
  "Central Jylland",
  "South Jylland",
  "North Jylland",
  "Capital Region",
  "Zealand"
];
function fetchEverything() {
  fetch(endpoint + "/users")
    .then(res => res.json())
    .then(function(data) {
      console.log("users:", data);
    });

  fetch(endpoint + "/money")
    .then(res => res.json())
    .then(function(data) {
      console.log("donations: ", data);
    });

  fetch(endpoint + "/volunteer")
    .then(res => res.json())
    .then(function(data) {
      console.log("volunteer at", data);
      changeArea(data);
    });
}

function changeArea() {
  let newArea = area[Math.floor(Math.random() * area.length)];
  // oldArea = newArea;
  console.log(newArea);
}
