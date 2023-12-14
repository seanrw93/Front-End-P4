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

formData.forEach(data => {
  const input = data.querySelector("input")
  if (input.name === "birthdate") {
    input.setAttribute("max", `${getTodaysdate()}`)
  }
})

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


//Set custom validation method
function customValidation(data) {
  const input = data.querySelector("input")
  const inputError = data.dataset.error;

  if (!input.validity.valid) {
    console.log(`Invalid ${input.name}`)
    data.style.content = inputError;
    data.setAttribute("data-error-visible", "true");
    input.setCustomValidity(inputError);
  } else {
    data.style.content = "";
    console.log(`Valid ${input.name}`)
    data.removeAttribute("data-error-visible");
    data.setAttribute("data-error-visible", "false");
    data.setCustomValidity("");
  }
}

//Check inputs of each formData to see if they are valid according to customValidation
formData.forEach(data => {
  const input = data.querySelector("input");
  input.addEventListener("change", () => {
    customValidation(data);
  });
});

function processFormSubmission(e) {
  e.preventDefault();
  getUserData();
  closeModal(modalbg);
  form.reset();

  setTimeout(() => {
    launchModal(modalConf)
  }, 200);
}

form.addEventListener("submit", processFormSubmission);