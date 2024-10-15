// Selecting DOM elements
const form = document.querySelector("#paymentForm");
const submitButton = document.querySelector("#submit");
const closeBtn = document.getElementsByClassName("close")[0];
const payNowButton = document.getElementById('payNowButton');
const showQRButton = document.getElementById('showQRButton');
const showQR = document.getElementById('showQR');
const amountInput = document.getElementById('amountToPay');
const amountErrorMessage = document.getElementById('amountErrorMessage');
const nameInput = document.getElementById('name');
const noteInput = document.getElementById('note');
const paymentOptions = document.getElementById('paymentOptions');
const image_row = document.getElementById('image_row');
const paymentAmount = document.getElementById('paymentAmount');

// Disable right-click context menu on the page
document.addEventListener("contextmenu", e => e.preventDefault(), false);

// Function to retrieve URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queryArray = queryString.split("&");

    queryArray.forEach(param => {
        const [key, value] = param.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    });

    return params;
}

// Call prefillForm when the page loads to auto-fill the form
document.addEventListener('DOMContentLoaded', prefillForm);

// Function to prefill the form based on URL parameters
function prefillForm() {
    const urlParams = getUrlParams();

    // Prefill the form inputs with values from the URL if available
    if (urlParams['name']) {
        nameInput.value = urlParams['name'];
    }
    if (urlParams['am']) {
        amountInput.value = urlParams['am'];
    }
    if (urlParams['note']) {
        noteInput.value = urlParams['note'];
    }

    // If all required fields are prefilled, trigger a form submission
    if (urlParams['name'] && urlParams['am'] && urlParams['note']) {
        submitButton.click();
    }
}

// Form submission handling
form.addEventListener('submit', e => {
    submitButton.disabled = true;  // Disable the submit button to prevent multiple submissions
    e.preventDefault();  // Prevent the default form submission behavior

    // Show the loading overlay while processing the form submission
    document.getElementById('loadingOverlay').style.display = 'flex'; 

    let requestBody = new FormData(form);

    // Send the form data to the server using fetch API
    fetch('https://script.google.com/macros/s/AKfycbxbPqP15KDrCXagGpCt7uyjbbsn8SrGX3fkw-ZPmUGut16IRUihC-dPjV21L0wkSDfL/exec', {
        method: 'POST',
        body: requestBody
    })
    .then(response => {
        if (response.ok) {
            // Hide the current step and show the next one if submission is successful
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
        } else {
            throw new Error('Network response was not ok.');
        }
        submitButton.disabled = false;  // Re-enable the submit button
        document.getElementById('loadingOverlay').style.display = 'none';  // Hide loading overlay
    })
    .catch(error => {
        // Handle submission error and show error message
        alert('Error! Unable to submit your data. Please try again later.');
        submitButton.disabled = false;  // Re-enable the submit button
        document.getElementById('loadingOverlay').style.display = 'none';  // Hide loading overlay
    });
});

// Form validation function to ensure required fields are filled
function validateForm() {
  if (amountInput.checkValidity()) {
      // Clear error message and invalid styling if input is valid
      amountErrorMessage.textContent = ''; 
      amountInput.classList.remove('invalid'); 
      return true;
  } else {
      // Show error message and apply invalid styling if input is empty or invalid
      amountErrorMessage.textContent = "Amount cannot be empty"; 
      amountInput.classList.add('invalid'); 
      return false;
  }
}

// Event listener for 'Pay Now' button
payNowButton.addEventListener('click', () => {
  // Validate the form before processing the payment
  if (validateForm()) {
      const enteredName = nameInput.value;
      const enteredAmount = amountInput.value;
      const enteredNote = noteInput.value;

      // Construct the payment link using UPI scheme
      const basePaymentLink = `pay?pa=aryan9356@ybl&am=${enteredAmount}&tn=Paid by ${enteredName} with note ${enteredNote}`;

      //Show Payment Options
      paymentOptions.classList.remove('hidden');
      document.getElementById('paymentAmount').textContent = `Amount: ${enteredAmount}`;
    }
});

// Function to open the respective UPI link
function openUPILink(prefix) {
  // Create the full UPI link
  const fullLink = `${prefix}${basePaymentLink}`;

  // Open the link
  window.location.href = fullLink;
}

// Event listener for 'Show QR Code' button
showQRButton.addEventListener('click', () => {    
  // Show loading overlay while generating QR code
  document.getElementById('loadingOverlay').style.display = 'flex';
  
  // Validate form before showing the QR code
  if (validateForm()) {

      const enteredName = nameInput.value;
      const enteredAmount = amountInput.value;
      const enteredNote = noteInput.value;

      // Construct UPI payment link
      const paymentLink = `upi://pay?pa=aryan9356@ybl&am=${enteredAmount}&tn=Paid by ${enteredName} with note ${enteredNote}`;

      // Create the QR code URL using a third-party service
      const paymentQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentLink)}`;

      // Set the QR code image source to the generated link
      document.getElementById('paymentQRCode').src = paymentQR;

      // Load the QR code and display it once loaded
      const qrCodeImage = document.getElementById('paymentQRCode');
      qrCodeImage.onload = () => {
          // Show payment amount on the UI
          document.getElementById('paymentAmount').textContent = `Amount: ${enteredAmount}`;
          showQR.classList.remove('hidden');  // Display the QR section
          document.getElementById('loadingOverlay').style.display = 'none'; // Hide loading overlay
      };
  }
});