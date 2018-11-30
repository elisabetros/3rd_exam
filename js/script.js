"use strict";

window.addEventListener("load", fetchEverything);
let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io/";
let userID = [];

function fetchEverything() {
  fetch(endpoint + "/users")
    .then(res => res.json())
    .then(function(data) {
      let gender = [0, 0, 0];

      for (let i = 0; i < data.length; i++) {
        if (data[i].gender === "f") {
          gender[0]++;
        } else if (data[i].gender === "m") {
          gender[1]++;
        } else {
          gender[2]++;
        }
      }
      console.log("users:", data);
      console.log("female", gender[0]);
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
  let userIDvol = [];
  fetch(endpoint + "/volunteer")
    .then(res => res.json())
    .then(function(data) {
      let allVolunteer = 0;
      let area = [0, 0, 0, 0, 0];

      for (let i = 0; i < data.length; i++) {
        userIDvol.push(data[i].userID);
        console.log("volunteer userID is:", userIDvol);

        if (data[i].area === "Zealand") {
          area[0]++;
          allVolunteer++;
        } else if (data[i].area === "Capital Region") {
          area[1]++;
          allVolunteer++;
        } else if (data[i].area === "Southern Jutland") {
          area[2]++;
          allVolunteer++;
        } else if (data[i].area === "Central Jutland") {
          area[3]++;
          allVolunteer++;
        } else if (data[i].area === "Northern Jutland") {
          area[4]++;
          allVolunteer++;
        }
      }
      const totalVolunteer = document.getElementById("totalVolunteer");
      totalVolunteer.querySelector("h1").innerHTML = allVolunteer;
      console.log("volunteer at", data);
      console.log("all volunteers", allVolunteer);
      displayVolunteering(area);
    });
}

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

function displayVolunteering(area) {
  let steps = 1;
  let max = 100;
  new Chart(document.getElementById("volunteeringChart"), {
    scaleOverride: true,
    scaleSteps: steps,
    scaleStepWidth: Math.ceil(max / steps),
    scaleStartValue: 0,
    type: "bar",
    beginAtZero: true,

    // scaleOverride: true,
    // scaleSteps: step,
    // scaleStepWidth: Math.ceil(max / step),
    // scaleStartValue: 0,
    // ticks: {
    //   beginAtZero: true,
    //   callback: function(value) {
    //     if (value % 1 === 0) {
    //       return value;
    //     }
    //   }

    data: {
      labels: [
        "Zealand",
        "Capital Region",
        "Southern Jutland",
        "Central Jutland",
        "Northern Jutland"
      ],
      datasets: [
        {
          label: "Volunteers available",
          backgroundColor: [
            "#3e95cd",
            "#8e5ea2",
            "#3cba9f",
            "#e8c3b9",
            "#c45850"
          ],
          data: area
        }
      ]
    },

    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              min: 0,
              stepSize: 1,
              max: 6
            }
          }
        ]
      },
      legend: { display: false },
      title: {
        display: true,
        text: "Volunteering (by regions)"
      }
    }
  });
}

Chart.scaleService.updateScaleDefaults("linear", {
  ticks: {
    min: 0
  }
});
