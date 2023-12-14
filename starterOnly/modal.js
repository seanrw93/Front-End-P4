function toggleResponsiveNav() {
  const x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".modal-form");
const modalConf = document.querySelector(".modal-confirm")
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelector(".close")
const form = document.forms.reserve;

// launch modal event
modalBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    launchModal(modalbg);
  })
});

//Close modal event
closeBtn.addEventListener("click", e => {
  if (e.target.classList.contains("close")) {
    closeModal(modalbg);
    closeModal(modalBtn);
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal(modalbg);
    closeModal(modalConf);
  }
})


// launch modal form
function launchModal(modal) {
  modal.style.display = "block";
  disablePageScroll();
}

//Close modal form
function closeModal(modal) {  
  modal.style.display = "none";
  closeBtn.blur();
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

function handleValueMissing(e, errorMessage) {
  if (e.target.validity.valueMissing) {
    e.target.setCustomValidity(errorMessage);
  } else {
    e.target.setCustomValidity("");
  }
}

function processFormSubmission(e) {
  e.preventDefault();

  let userData = new UserData();

  // formData.forEach(formElement => {
  //   const input = formElement.querySelector(".input");

  //   switch (input.name) {
  //     case "first": 
  //       input.addEventListener("input", e => handleValueMissing(e, "Please enter your first name"));
  //       break;
  //   }
  // })

  // Convert the UserData instance to JSON
  // let jsonUserData = userData.toJson();
  // console.log(jsonUserData);
  closeModal(modalbg);

  setTimeout(() => {
    launchModal(modalConf)
  }, 200);
}

form.addEventListener("submit", processFormSubmission)