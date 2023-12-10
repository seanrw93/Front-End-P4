function toggleResponsiveNav() {
  const x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelector(".close")
const form = document.forms.reserve;

// launch modal event
modalBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    launchModal();
  })
});

closeBtn.addEventListener("click", () => closeModal());

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
  disablePageScroll();
  closeBtn.addEventListener("click", closeModal);
}

//Close modal form
function closeModal() {  
  modalbg.style.display = "none";
  enablePageScroll();

  closeBtn.removeEventListener("click", closeModal);
}

// Disable page scroll
function disablePageScroll() {
  document.body.style.overflow = "hidden";
}

// Enable page scroll
function enablePageScroll() {
  document.body.style.overflow = "";
}

//Class to hold form data 
class UserData {
  constructor(firstName, lastName, email, birthDate, tournamentsNum, location, checkbox) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.birthDate = birthDate;
    this.tournamentsNum = tournamentsNum;
    this.location = location;
    this.checkbox = checkbox || [];
  }

  toJson() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      birthDate: this.birthDate,
      tournamentsNum: this.tournamentsNum,
      location: this.location,
      checkbox: this.checkbox
    }
  }
}

function processFormSubmission(e) {
  e.preventDefault();

  // let userData = new UserData();

  // Convert the UserData instance to JSON
  // let jsonUserData = userData.toJson();
  // console.log(jsonUserData);

  closeModal();

}

form.addEventListener("submit", processFormSubmission)