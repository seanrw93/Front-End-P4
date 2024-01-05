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

  // Reset custom validity for each input
  formData.forEach(data => {
    const input = data.querySelector("input");
    input.setCustomValidity("");
  });

  // Remove specified attributes from each element
  formData.forEach(data => {
    const inputParent = data.querySelector(".formData");

    // Check if inputParent is not null before accessing properties
    if (inputParent) {
      inputParent.style.content = "";
      inputParent.removeAttribute("data-error");
      inputParent.removeAttribute("data-error-visible");
    }
  });

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
function getTodaysDate() {
  const date = new Date()
  const currentYear = date.getFullYear();
  const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  const currentDate = String(date.getDate()).padStart(2, '0'); 

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
    inputParent.setAttribute("data-error", inputError);
    inputParent.style.content = inputParent.getAttribute("data-error");
    inputParent.setAttribute("data-error-visible", "true");
    input.setCustomValidity(inputError);
  } else {
    inputParent.style.content = "";
    inputParent.removeAttribute("data-error");
    inputParent.removeAttribute("data-error-visible");
    input.setCustomValidity("");
  }
}

//Generate error messages to be used in check functions
function errorMessage({minCharLength = null} = {}) {
    const errors = {
      firstNameError: "Please enter your first name",
      lastNameError: "Please enter your first name",
      birthdateError: "Please enter your birthdate",
      minCharError: minCharLength ? `Please enter ${minCharLength} or more characters` : null
    }

    return errors
}

function handleValidation(inputParent) {
  const input = inputParent.querySelector("input");
  let inputError = null;

  switch(input.name) {
    case "first":
    case "last": 
      inputError = nameCheck(input, 3);
      break;
    case "email":
      inputError = emailCheck(input);
      break;
    case "birthdate":
      inputError = ageCheck(input);
      break;
    case "quantity":
      inputError = quantityCheck(input);
      break;
    case "location":
      inputError = locationCheck(input);
      break;

    //More cases to come for other checks
  }

  console.log("inputError:", inputError);

  addInvalidityStyles(inputParent, input, inputError);
}

function nameCheck(input, min) {
  if (input.value.trim() === "") {
    if (input.name === "first") {
      return errorMessage().firstNameError;
    } else {
      return errorMessage().lastNameError;
    }
  } else if (input.value.length < min) {
    return errorMessage({minCharLength: min - 1}).minCharError;
  } else {
    return null;
  }
}

function emailCheck(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(input.value.trim() === "" || !emailRegex.test(input.value)) {
    return errorMessage().emailError;
  } else {
    return null;
  }
}

function ageCheck(input) {
  console.log("ageCheck called with input:", input)
  const ageRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (input.value.trim() === "" || !ageRegex.test(input.value)) {
    return errorMessage().birthdateError;
  } else {
    return null;
  }
}

function quantityCheck(input) {
  if (isNaN(input.value) || input.value < 1 || input.value.trim() === "") {
    return "Please enter the amount of tournaments";
  } else {
    return null
  }
}

function locationCheck(input) {
  const radioButtons = input.getElementsByName("location");
  let radioButtonChecked = false;

  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      radioButtonChecked = true;
      break;
    }
  }

  if (!radioButtonChecked) {
    return "Please choose a location"
  } else {
    return null
  }
}

//Check inputs of each formData to see if they are valid according to customValidation
//Today's date used for max value of date input
formData.forEach(data => {
  const input = data.querySelector("input");
  if (input.name === "birthdate") {
    input.setAttribute("max", getTodaysDate())
  }

  input.addEventListener("change", () => handleValidation(data));
});

//Process form information
function processFormSubmission(e) {
  e.preventDefault();

  let formIsValid = true;

  formData.forEach(data => {
    const input = data.querySelector("input");
    if (!input.value || input.value.trim() === "") {
      input.setCustomValidity("Did you see this field?");
      formIsValid = false;
    } else {
      input.setCustomValidity("");
    }
  });

  if (formIsValid) {
    getUserData();
    form.reset();
    closeModal(modalbg);
    launchModal(modalConf);
  }
}

//Submit form
form.addEventListener("submit", processFormSubmission);