"use strict";

window.addEventListener("load", isLoggedInAsAdmin);

let endpoint = "http://5bdffe7bf2ef840013994a18.mockapi.io/";
let userID = [];
let volunteerUserIds = [];
let donationUserIds = [];
let userData;

// function countAge(userData) {
//   console.log("userData for age function", userData);
//   let age = [];
//   for (let i = 0; i < userData.length; i++) {
//     let birthDate = userData[i].birthDate;
//     let birthYear = birthDate.substr(birthDate.length - 4);
//     // console.log("birthYear", birthYear);
//     let today = new Date();
//     age.push(today.getFullYear() - birthYear);
//   }
//   console.log("age", age);
// }

//create lists of all users data, combine data from different endpoints

function createUserData(allData) {
  let usersAllData = [];
  let users = allData.users;

  let donations = allData.donations;
  let volunteers = allData.volunteers;
  console.log("donations", donations);
  for (let i = 0; i < users.length; i++) {
    let user = {
      userID: Number(users[i].id),
      name: users[i].name,
      dateOfBirth: users[i].birthDate,
      donations: [],
      projects: [],
      region: "",
      tel: users[i].phonenumber,
      email: users[i].email
    };
    usersAllData.push(user);
  }

  console.log("usersAllData", usersAllData);
  for (let i = 0; i < usersAllData.length; i++) {
    for (let u = 0; u < donations.length; u++) {
      if (usersAllData[i].userID == donations[u].userID) {
        usersAllData[i].donations.push(donations[u]);
        // console.log(
        //   "it's a match!",
        //   usersAllData[i].userID,
        //   donations[u].userID
        // );
      }
    }
  }
  console.log("users with donations", usersAllData);
  for (let i = 0; i < usersAllData.length; i++) {
    for (let u = 0; u < volunteers.length; u++) {
      if (usersAllData[i].userID == volunteers[u].userID) {
        usersAllData[i].region = volunteers[u].area;
        usersAllData[i].projects.push(...volunteers[u].projects);
        // console.log(
        //   "it's a match!",
        //   usersAllData[i].userID,
        //   volunteers[u].userID
        // );
      }
    }
  }
  return usersAllData;
}

//insert data to DOM

function createLists(usersAllData) {
  console.log("users all data in template", usersAllData);
  let template = document.querySelector("#donationTemp").content;
  for (let i = 0; i < usersAllData.length; i++) {
    // console.log("usersAllData[i]", usersAllData[i]);
    if (usersAllData[i].donations && usersAllData[i].donations.length) {
      // console.log("usersAllData[i].donations", usersAllData[i].donations);
      for (let u = 0; u < usersAllData[i].donations.length; u++) {
        // console.log(
        //   "usersAllData[i].donations[u] ",
        //   usersAllData[i].donations[u]
        // );
        let clone = template.cloneNode(true);
        clone.querySelector("#userName").textContent = usersAllData[i].name;
        clone.querySelector("#amountDonated").textContent =
          usersAllData[i].donations[u].amount + "dkk";

        clone.querySelector("#dateDonated").textContent = moment(
          usersAllData[i].donations[u].date
        ).format("DD[/]MM[/]YYYY");

        document.querySelector("#donations").appendChild(clone);
      }

      let modalDonation = document.querySelector(".modalDonations");
      let btnDonations = document.querySelector("#allDonations");
      btnDonations.addEventListener("click", function() {
        modalDonation.style.display = "block";
      });

      window.onclick = function(event) {
        if (event.target == modalDonation) {
          modalDonation.style.display = "none";
        }
      };
    }
  }
}

function sortByRegion(a, b) {
  if (a.region < b.region) {
    return -1;
  } else if (a.region > b.region) {
    return 1;
  } else {
    return 0;
  }
}

function createVolunteerList(usersAllData) {
  let template = document.querySelector("#volunteerTemp").content;
  let sortedRegion = usersAllData.sort(sortByRegion);
  console.log("sortedRegion", sortedRegion);
  for (let i = 0; i < usersAllData.length; i++) {
    if (usersAllData[i].region) {
      console.log("usersAllData[i] with region", usersAllData[i].region);
      let clone = template.cloneNode(true);
      clone.querySelector("#volunteerRegion").textContent =
        usersAllData[i].region;
      clone.querySelector("#voluntName").textContent = usersAllData[i].name;
      clone.querySelector("#volunteerEmail").textContent =
        usersAllData[i].email;
      clone.querySelector("#volunteerTel").textContent = usersAllData[i].tel;
      document.querySelector("#volunteerDonations").appendChild(clone);
    }
  }
  let btnVolunteer = document.querySelector("#allVolunteers");
  let modalVolunteers = document.querySelector(".volunteerDonations");
  btnVolunteer.addEventListener("click", function() {
    modalVolunteers.style.display = "block";
  });
}

//admins Authentication

const admins = [
  {
    id: 1,
    name: "Katya",
    password: 222111
  },
  {
    id: 2,
    name: "Elisabet",
    password: 111222
  }
];

let adminName = document.querySelector("#adminName");

let submitAdmin = document.querySelector("#submitAdmin");
let loginAdmin = document.querySelector("#loginform");

submitAdmin.addEventListener("click", function(e) {
  e.preventDefault();
  let inputName = document.querySelector("#username").value;
  let passwordAdmin = document.querySelector("#password").value;
  console.log("value", inputName);
  console.log("pass", passwordAdmin);
  let exists = false;
  for (let i = 0; i < admins.length; i++) {
    if (inputName == admins[i].name && passwordAdmin == admins[i].password) {
      exists = true;
      console.log("match", admins[i].name);
      let admin = admins[i];
      loginAdmin.style.display = "none";
      adminName.textContent = "Hello" + " " + admins[i].name + "!";
      sessionStorage.setItem("admin", JSON.stringify(admin));
      init();
    }
  }
  if (!exists) {
    alert("wrong password or login");
  }
});

function isLoggedInAsAdmin() {
  let admin = JSON.parse(sessionStorage.getItem("admin"));
  if (admin) {
    console.log("logged in as admin", admin);
    loginAdmin.style.display = "none";
    init();
  } else {
    loginAdmin.style.display = "block";
  }
}

let logOutBtn = document.querySelector("#logout");

logOutBtn.addEventListener("click", function() {
  logOutAdmin();
});

function logOutAdmin() {
  alert("You have successfully logged out");
  setTimeout(function() {
    sessionStorage.removeItem("admin");
    window.location.href = "index.html";
  }, 1000);
}

//admins authentication ends

// menu
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//menu ends

function fetchDonations() {
  return new Promise((resolve, reject) => {
    fetch(endpoint + "/money")
      .then(res => res.json())
      .then(function(data) {
        resolve(data);
      });
  });
}
function donationsOverview(donations) {
  // console.log("donations: ", donations);
  let totalAmount = 0;
  let amountOverview = [0, 0, 0, 0];
  for (let i = 0; i < donations.length; i++) {
    donationUserIds.push(donations[i].userID);
    // console.log("donations userID is:", donationUserIds);
    // Convert to int
    donations[i].amount = parseInt(donations[i].amount);

    // Add to total amount
    totalAmount = totalAmount + donations[i].amount;
    // console.log("totalAmount: ", totalAmount);

    // Put into overview
    if (donations[i].amount < 100) {
      amountOverview[0]++;
    } else if (donations[i].amount >= 100 && donations[i].amount < 500) {
      amountOverview[1]++;
    } else if (donations[i].amount >= 500 && donations[i].amount < 1000) {
      amountOverview[2]++;
    } else if (donations[i].amount >= 1000) {
      amountOverview[3]++;
    }
  }
  //display all the donations
  const totalMoney = document.getElementById("totalMoney");
  totalMoney.querySelector("h1").innerHTML = totalAmount + " dkk";
  console.log("amountOverview: ", amountOverview);
  return amountOverview;
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

// function countGenders(userData) {
//   let gender = [0, 0, 0];

//   for (let i = 0; i < userData.length; i++) {
//     if (userData[i].gender === "f") {
//       gender[0]++;
//     } else if (userData[i].gender === "m") {
//       gender[1]++;
//     } else {
//       gender[2]++;
//     }
//   }

//   return gender;
// }

function countVolunteersByAreas(volunteers) {
  let allVolunteer = 0;
  let area = [0, 0, 0, 0, 0];

  for (let i = 0; i < volunteers.length; i++) {
    volunteerUserIds.push(volunteers[i].userID);
    // console.log("volunteer userID is:", volunteerUserIds);

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
  console.log("displaychartcalled", amountOverview);
  // USE AMOUNTOVERVIEW AS DATA WHEN IT WORKS !!
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

function matchByGender(userData, userIds) {
  let matchByGender = [0, 0];
  for (let i = 0; i < userData.length; i++) {
    let exists = false;
    // console.log("first loop!", userData[i].id);
    for (let u = 0; u < userIds.length; u++) {
      // console.log("userData[i].id", userData[i].id);
      // console.log("userIds[u]", userIds[u]);
      if (Number(userData[i].id) == Number(userIds[u])) {
        exists = true;
        // console.log("it's a match", userData[i].id, userIds[u]);
      }
    }

    if (exists) {
      if (userData[i].gender === "f") {
        // console.log("female detected!");
        matchByGender[0]++;
      } else {
        matchByGender[1]++;
      }
    }

    if (!exists) {
      // console.log("Not existing in volunteers array. Dont count.");
    }
  }
  console.log("matchByGender", matchByGender);
  return matchByGender;
}

function displayChartByGender(volunteersByGender, donationByGender) {
  console.log("displayChartByGender, volunteersByGender: ", volunteersByGender);
  console.log("displayChartByGender, donationByGender: ", donationByGender);
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
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function countAges(userData) {
  let ages = [];

  for (let i = 0; i < userData.length; i++) {
    // console.log("userData.birthDate", userData[i].birthDate);
    let birthDate = userData[i].birthDate;
    let birthYear = birthDate.substr(birthDate.length - 4);
    // console.log("birthYear", birthYear);
    let today = new Date();
    ages.push(today.getFullYear() - birthYear);
    // console.log("age", age);
    // splitAge(age);
  }

  return ages;
}

function splitAge(ages) {
  let agesOverview = [0, 0, 0, 0, 0];

  for (let i = 0; i < ages.length; i++) {
    // console.log("ages", ages[i]);
    if (ages[i] <= 18) {
      agesOverview[0]++;
    } else if (ages[i] > 18 && ages[i] <= 35) {
      agesOverview[1]++;
    } else if (ages[i] > 35 && ages[i] <= 50) {
      agesOverview[2]++;
    } else if (ages[i] > 50 && ages[i] <= 67) {
      agesOverview[3]++;
    } else if (ages[i] > 67) {
      agesOverview[4]++;
    }
    // console.log("agesOverview", agesOverview);
    // displayAgeChart(agesOverview);
  }

  return agesOverview;
}

function displayAgeChart(agesOverview) {
  new Chart(document.getElementById("bar-chart-horizontal"), {
    type: "horizontalBar",
    data: {
      labels: ["<18", "18-35", "36-50", "51-67", ">67"],
      datasets: [
        {
          label: "Age (years)",
          backgroundColor: [
            "#3e95cd",
            "#8e5ea2",
            "#3cba9f",
            "#e8c3b9",
            "#c45850"
          ],
          data: agesOverview
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Volunteers and donors by age"
      }
    }
  });
}
async function init() {
  // Fetch data
  const userData = await fetchUsers();

  const donations = await fetchDonations();
  const volunteers = await fetchVolunteers();

  // const genders = countGenders(userData);
  // Manipulate/convert data
  const volunteersByArea = countVolunteersByAreas(volunteers);

  const amountOverview = donationsOverview(donations);
  console.log("amount overview", amountOverview);
  const volunteersByGender = matchByGender(userData, volunteerUserIds);
  const donationByGender = matchByGender(userData, donationUserIds);
  console.log("volunteersByGender", volunteersByGender);
  console.log("donationByGender", donationByGender);
  // const donationByGender = matchDonationByGender(userData, donationUserIds);
  const ages = countAges(userData);
  const agesOverview = splitAge(ages);

  // Display data
  displayChart(amountOverview);
  displayChartByGender(volunteersByGender, donationByGender);
  displayVolunteering(volunteersByArea);
  displayAgeChart(agesOverview);

  const allData = {
    users: userData,
    donations: donations,
    volunteers: volunteers
  };
  const usersAllData = createUserData(allData);
  console.log("usersAll in init", usersAllData);
  createLists(usersAllData);
  createVolunteerList(usersAllData);
}
