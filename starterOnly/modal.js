function toggleResponsiveNav() {
  const nav = document.getElementById("myTopnav");
  if (nav.className === "topnav") {
    nav.className += " responsive";
  } else {
    nav.className = "topnav";
  }
}

const icon = document.querySelector(".icon")
icon.addEventListener("click", toggleResponsiveNav)


// DOM Elements
const modalbg = document.querySelector(".modal-form");
const modalConf = document.querySelector(".modal-confirm")
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelectorAll(".close")
const closeModalbtn = document.querySelector(".btn-close")
const form = document.forms.reserve;

// launch modal event
modalBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    launchModal(modalbg);
  })
});

//Close modal event via X button
closeBtn.forEach(btn => {
  btn.addEventListener("click", () => {
      closeModal(modalbg);
      closeModal(modalConf);
  })
})
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal(modalbg);
    closeModal(modalConf);
  }
})

//Close modal event via close button
closeModalbtn.addEventListener("click", () => closeModal(modalConf));


// launch modal form
function launchModal(modal) {
  modal.style.display = "block";
  disablePageScroll();
}

//Close modal form
function closeModal(modal) {  
  modal.style.display = "none";
  enablePageScroll();
  form.reset();
}

// Disable page scroll
function disablePageScroll() {
  document.body.style.overflow = "hidden";
}

// Enable page scroll
function enablePageScroll() {
  document.body.style.overflow = "";
}

// Get today's date and insert it as max date in date input in HTML
function getTodaysdate() {
  const date = new Date()
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const currentDate = date.getDate();

  return `${currentYear}-${currentMonth}-${currentDate}`
}

//Class to hold form data 
class UserData {
  constructor(first, last, email, birthdate, quantity, location, conditions) {
    this.first = first;
    this.last = last;
    this.email = email;
    this.birthdate = birthdate;
    this.quantity = quantity;
    this.location = location;
    this.conditions = conditions || [];
  }

  toJson() {
    return {
      first: this.first,
      last: this.last,
      email: this.email,
      birthdate: this.birthdate,
      quantity: this.quantity,
      location: this.location,
      conditions: this.conditions
    }
  }
}

//Collect form data and store in a new userData object
function getUserData() {
  let userData = new UserData();

  formData.forEach(data => {
    const input = data.querySelector("input");
    userData[input.name] = input.value;
  })

  // Convert the UserData instance to JSON
  let jsonUserData = userData.toJson();
  console.log(jsonUserData);
}

//Set styles for input with invalid values
function addInvalidityStyles(inputParent, input, inputError) {
  if (inputError) {
    inputParent.style.content = inputError;
    inputParent.setAttribute("data-error-visible", "true");
    input.setCustomValidity(inputError);
  } else {
    inputParent.style.content = "";
    inputParent.removeAttribute("data-error-visible");
    input.setCustomValidity("");
  }

  console.log(inputError);
}

//Custom validation checks
function handleNameValidation(inputParent) {
  const input = inputParent.querySelector("input");
  let inputError = inputParent.dataset.error;

  if (input.value.trim() === "") {
    if (input.name === "first") {
      inputError = "Please enter your first name";
    } else {
      inputError = "Please enter your last name";
    }
  } else if (input.value.length < 3) {
    inputError = "Please enter 2 or more characters";
  }

  addInvalidityStyles(inputParent, input, inputError);
}

function handleEmailValidation(inputParent) {
  const input = inputParent.querySelector("input");
  let inputError = inputParent.dataset.error;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(input.value.trim() === "" || !emailRegex.test(input.value)) {
    inputError = "Please enter a valid email address";
  }

  addInvalidityStyles(inputParent, input, inputError);
}


function handleAgeValidation(inputParent) {
  const input = inputParent.querySelector("input");
  let inputError = inputParent.dataset.error;

  const ageRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (input.value.trim() === "" || !ageRegex.test(input.value)) {
    inputError = "Please enter your date of birth"
  }

  addInvalidityStyles(inputParent, input, inputError);
}

function handleQuantityValidation(inputParent) {
  const input = inputParent.querySelector("input");
  let inputError = inputParent.dataset.error;

  if (isNaN(input.value) || input.value < 1 || input.value.trim() === "") {
    inputError = "Please enter the amount of tournaments";
  }

  addInvalidityStyles(inputParent, input, inputError);
}

function handleConditionsValidation(inputParent) {
  const input = inputParent.querySelector("input");
  let inputError = inputParent.dataset.error;

}

//Check inputs of each formData to see if they are valid according to customValidation
//Today's date used forax value of date input
formData.forEach(data => {
  const input = data.querySelector("input");
  if (input.name === "birthdate") {
    input.setAttribute("max", `${getTodaysdate()}`)
  }

  switch (input.type) {
    case "text": 
    input.addEventListener("change", () => handleNameValidation(data));
    break;
  case "email":
    input.addEventListener("change", () => handleEmailValidation(data));
    break;
  case "date": 
    input.addEventListener("change", () => handleAgeValidation(data));
    break;
  case "number":
    input.addEventListener("change", () => handleQuantityValidation(data));
  }
});

//Process form information
function processFormSubmission(e) {
  e.preventDefault();
  getUserData();
  closeModal(modalbg);
  form.reset();
  launchModal(modalConf)
}

//Submit form
form.addEventListener("submit", processFormSubmission);