"use strict";

window.addEventListener("load", fetchEverything);
let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io/";
let userID = [];
// let area = [
//   "Central Jylland",
//   "South Jylland",
//   "North Jylland",
//   "Capital Region",
//   "Zealand"
// ];
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
      let totalAmount = 0;
      let amountOverview = [0, 0, 0, 0];
      for (let i = 0; i < data.length; i++) {
        // Convert to int
        data[i].amount = parseInt(data[i].amount);

        // Add to total amount
        totalAmount = totalAmount + data[i].amount;
        console.log("totalAmount: ", totalAmount);

        // Put into overview
        if (data[i].amount < 100) {
          amountOverview[0]++;
        } else if (data[i].amount >= 100 && data[i].amount < 500) {
          amountOverview[1]++;
        } else if (data[i].amount >= 500 && data[i].amount < 1000) {
          amountOverview[2]++;
        } else if (data[i].amount >= 1000) {
          amountOverview[3]++;
        }
      }
      //display all the donations
      const totalMoney = document.getElementById("totalMoney");
      totalMoney.querySelector("h1").innerHTML = totalAmount + " dkk";
      console.log("amountOverview: ", amountOverview);
      displayChart(amountOverview);
    });

  fetch(endpoint + "/volunteer")
    .then(res => res.json())
    .then(function(data) {
      console.log("volunteer at", data);
    });
}

// function changeArea() {
//   let newArea = area[Math.floor(Math.random() * area.length)];
//   // oldArea = newArea;
//   console.log(newArea);
// }

function displayChart(amountOverview) {
  new Chart(document.getElementById("donationChart"), {
    type: "pie",
    data: {
      labels: ["> 100", "101-499", "500-999", "999 <"],
      datasets: [
        {
          label: "Donations (dkk)",
          backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9"],
          data: amountOverview
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Donations amount"
      }
    }
  });
}
