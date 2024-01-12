//Responsive nav bar
function toggleResponsiveNav() {
  const nav = document.getElementById("myTopnav");
  if (nav.className === "topnav") {
    nav.className += " responsive";
  } else {
    nav.className = "topnav";
  }
}

const icon = document.querySelector(".icon");
icon.addEventListener("click", toggleResponsiveNav);


// DOM Elements
const modalbg = document.querySelector(".modal-form");
const modalConf = document.querySelector(".modal-confirm");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelectorAll(".close");
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

  // Remove specified attributes from each element
  formData.forEach(data => {

    // Check if data is not null before accessing properties
    if (data) {
      data.style.content = "";
      data.removeAttribute("data-error");
      data.setAttribute("data-error-visible", "false");
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
  constructor(first, last, email, birthdate, quantity, location, notifications) {
    this.first = first;
    this.last = last;
    this.email = email;
    this.birthdate = birthdate;
    this.quantity = quantity;
    this.location = location;
    this.notifications = notifications;
  }

  toJson() {
    return {
      first: this.first,
      last: this.last,
      email: this.email,
      birthdate: this.birthdate,
      quantity: this.quantity,
      location: this.location,
      notifications: this.notifications
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

//Handle error messages
const required = () => (value) => value || value.trim() !== "";
const minLengthCheck = (min) => (value) => value.length >= min;
const minValCheck = (min) => (value) => Number(value) >= min;
const maxValCheck = (max) => (value) => Number(value) <= max;
const patternCheck = (regex) => (value) => regex.test(value);

//Custom validation for each input
const fields = {
  first : {
    validator: value => minLengthCheck(2)(value) && required()(value),
    errorMessage: "Please enter a first name that is 2+ characters long",
  },
  last : {
    validator: value => minLengthCheck(2)(value) && required()(value),
    errorMessage: "Please enter a last name that is 2+ characters long",
  },
  email: {
    validator: value => patternCheck(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)(value) && required()(value),
    errorMessage: "Please enter a valid email address",
  },
  birthdate: {
    validator: value => patternCheck(/^\d{4}-\d{2}-\d{2}$/)(value) && required()(value),
    errorMessage: "Please enter a valid birth date in DD/MM/YYYY format",
  },
  quantity: {
    validator: value => minValCheck(0)(value) && maxValCheck(99)(value) && required()(value),
    errorMessage: "Please enter the amount of tournaments have participated in",
  },
  // location: {
  //   validator: () => Array.from(document.querySelectorAll('[name="location"]')).some(radio => radio.checked),
  //   errorMessage: "Please choose a location",
  // },
  termsConds : {
    validator: () => document.querySelector('[name="termsConds"]').checked,
    errorMessage: "Please accept the terms and conditions",
  }
};

//Get latest date in calendar 
formData.forEach(data => {
  const input = data.querySelector("input");
  if (input.name === "birthdate") {
    input.setAttribute("max", getTodaysDate())
  }
})

//Set styles for input with invalid values
function handleErrorMessage(input, errorMessage = null) {
  const inputParent = input.parentElement

  if (errorMessage) {
    inputParent.setAttribute("data-error", errorMessage);
    inputParent.setAttribute("data-error-visible", "true");
  } else {
    inputParent.removeAttribute("data-error");
    inputParent.removeAttribute("data-error-visible");
  }
}

//Check if input is valid
function validateInput(input) {
  if (!input) return false;

  const fieldName = input.getAttribute("name");
  const validation = fields[fieldName];
  const value = input.type === "checkbox" ? input.checked : input.value;

  let isValid = validation.validator(value);

  // Call handleErrorMessage function
  handleErrorMessage(input, isValid ? null : validation.errorMessage);

  return isValid;
}

//Add event listener to each input
for (const fieldName in fields) {
  const input = document.querySelector(`[name="${fieldName}"]`);

  input.addEventListener("change", () => {
      validateInput(input);
  });

}

//List of required checkboxes
const requiredCheckboxes = ["termsConds"]

//Submit form
form.addEventListener("submit", e => {
    e.preventDefault();

    let isValid = true;

    // Check if each input is valid
    for (const fieldName in fields) {
        const inputs = document.querySelectorAll(`[name="${fieldName}"]`);
        let isValidField = true;

        inputs.forEach(input => {
          if (input.type === "checkbox") {
              if (requiredCheckboxes.includes(fieldName)) {
                  isValidField = input.checked;
              } else {
                  input = document.querySelector(`[name="${fieldName}"]:checked`);
                  isValidField = validateInput(input);
              }
          } else {
              isValidField = validateInput(input);
          }
        })

        // If the field is not valid, display the error message
        if (!isValidField && fieldName === "termsConds") {
            handleErrorMessage(inputs[0], fields[fieldName].errorMessage);
        }

        isValid = isValidField && isValid;
    }

    // If all inputs are valid, get user data, reset form, close modal and launch confirmation modal
    if (!isValid) {
      setTimeout(() => alert("Some fields are invalid. Please check the form and try again."), 0);
    } else {
        getUserData();
        form.reset();
        closeModal(modalbg);
        launchModal(modalConf);
    }

    console.log(isValid);
});