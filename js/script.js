"use strict";

window.addEventListener("load", init);
let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io/";
let userID = [];

let volunteerUserIds = [];
let donationUserIds = [];
let userData;

Chart.scaleService.updateScaleDefaults("linear", {
  ticks: {
    min: 0
  }
});

function fetchDonations() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/money")
      .then(res => res.json())
      .then(function(data) {
        console.log("donations: ", data);
        let totalAmount = 0;
        let amountOverview = [0, 0, 0, 0];
        for (let i = 0; i < data.length; i++) {
          donationUserIds.push(data[i].userID);
          console.log("donations userID is:", donationUserIds);
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

        resolve(amountOverview);
      });
  });
}

function fetchUsers() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/users")
      .then(res => res.json())
      .then(function(data) {
        resolve(data);
      });
  });
}

function fetchVolunteers() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/volunteer")
      .then(res => res.json())
      .then(function(data) {
        console.log("fetch(endpoint + /volunteer userID is: data:", data);
        resolve(data);
      });
  });
}

function countGenders(userData) {
  let gender = [0, 0, 0];

  for (let i = 0; i < userData.length; i++) {
    if (userData[i].gender === "f") {
      gender[0]++;
    } else if (userData[i].gender === "m") {
      gender[1]++;
    } else {
      gender[2]++;
    }
  }

  return gender;
}

function countVolunteersByAreas(volunteers) {
  let allVolunteer = 0;
  let area = [0, 0, 0, 0, 0];

  for (let i = 0; i < volunteers.length; i++) {
    volunteerUserIds.push(volunteers[i].userID);
    console.log("volunteer userID is:", volunteerUserIds);

    if (volunteers[i].area === "Zealand") {
      area[0]++;
      allVolunteer++;
    } else if (volunteers[i].area === "Capital Region") {
      area[1]++;
      allVolunteer++;
    } else if (volunteers[i].area === "Southern Jutland") {
      area[2]++;
      allVolunteer++;
    } else if (volunteers[i].area === "Central Jutland") {
      area[3]++;
      allVolunteer++;
    } else if (volunteers[i].area === "Northern Jutland") {
      area[4]++;
      allVolunteer++;
    }
  }
  const totalVolunteer = document.getElementById("totalVolunteer");
  totalVolunteer.querySelector("h1").innerHTML = allVolunteer;
  console.log("volunteer area", area);
  console.log("all volunteers", allVolunteer);

  return area;
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

function matchVolunteersByGender(userData, volunteerUserIds) {
  let volunteersByGender = [0, 0, 0];
  for (let i = 0; i < userData.length; i++) {
    let exists = false;
    // console.log("first loop!", userData[i].id);
    for (let u = 0; u < volunteerUserIds.length; u++) {
      // console.log("second loop!", volunteerUserIds[u]);
      if (userData[i].id == volunteerUserIds[u]) {
        exists = true;
        // console.log("it's a match", userData[i].id, volunteerUserIds[u]);
      }
    }

    if (exists) {
      if (userData[i].gender === "f") {
        // console.log("female detected!");
        volunteersByGender[0]++;
      } else if (userData[i].gender === "m" || userData[i].gender === "male") {
        // console.log("male detected!");
        volunteersByGender[1]++;
      } else {
        // Gender unknown
        volunteersByGender[2]++;
      }
    }

    if (!exists) {
      console.log("Not existing in volunteers array. Dont count.");
    }
  }
  console.log("volunteersByGender", volunteersByGender);
  return volunteersByGender;
}

function matchDonationByGender(userData, donationUserIds) {
  let donationByGender = [0, 0, 0];
  for (let i = 0; i < userData.length; i++) {
    let exists = false;
    console.log("first loop donation", userData[i].id);
    for (let u = 0; u < donationUserIds.length; u++) {
      if (userData[i].id == donationUserIds[u]) {
        exists = true;
      }
    }

    if (exists) {
      if (userData[i].gender === "f") {
        donationByGender[0]++;
      } else if (userData[i].gender === "m" || userData[i].gender === "male") {
        donationByGender[1]++;
      } else {
        donationByGender[2]++;
      }
    }
    if (!exists) {
      console.log("Not existing in donation array. Dont count.");
    }
  }
  console.log("donationsByGender", donationByGender);
  return donationByGender;
}

function displayChartByGender(volunteersByGender, donationByGender) {
  new Chart(document.getElementById("genderChart"), {
    type: "bar",
    data: {
      labels: ["Volunteering", "Donations"],
      datasets: [
        {
          label: "Male",
          backgroundColor: "#3e95cd",
          data: [volunteersByGender[1], donationByGender[1]]
        },
        {
          label: "Female",
          backgroundColor: "#8e5ea2",
          data: [volunteersByGender[0], donationByGender[0]]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Donations and volunteering (by gender)"
      }
    }
  });
}

function countAge(userData) {
  for (let i = 0; i < userData.length; i++) {
    console.log("userData.birthDate", userData[i].birthDate);
    let birthDate = userData[i].birthDate;
    let birthYear = birthDate.substr(birthDate.length - 4);
    console.log("birthYear", birthYear);
  }
}

async function init() {
  const userData = await fetchUsers();
  const genders = countGenders(userData);
  const donations = await fetchDonations();
  displayChart(donations);
  const volunteers = await fetchVolunteers();
  const volunteersByArea = countVolunteersByAreas(volunteers);
  const volunteersByGender = matchVolunteersByGender(
    userData,
    volunteerUserIds
  );
  const donationByGender = matchDonationByGender(userData, donationUserIds);
  displayChartByGender(volunteersByGender, donationByGender);
  displayVolunteering(volunteersByArea);
  countAge(userData);
}

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
