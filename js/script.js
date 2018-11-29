"use strict";

let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io/users/";
let userID = [];
let area = [
  "Central Jylland",
  "South Jylland",
  "North Jylland",
  "Capital Region",
  "Zealand"
];

fetch(endpoint)
  .then(res => res.json())
  .then(function(data) {
    data.forEach(user => {
      userID.push(user.id);
    });
    getDonations(userID);
    getVolunteers(userID);
  });

function getDonations(userID) {
  userID.forEach(id => {
    fetch(endpoint + id + "/money")
      .then(res => res.json())
      .then(function(data) {
        if (data.length !== 0) {
          // console.log("donations", data);
        }
      });
  });
}

function getVolunteers(userID) {
  userID.forEach(id => {
    fetch(endpoint + id + "/volunteer")
      .then(res => res.json())
      .then(function(data) {
        if (data.length !== 0) {
          // console.log(data[0].area);
          changeArea(data[0].area);
        }
      });
  });
}

function changeArea() {
  let newArea = area[Math.floor(Math.random() * area.length)];
  // oldArea = newArea;
  // console.log(newArea);
}
