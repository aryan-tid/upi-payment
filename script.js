const form = document.querySelector("#paymentForm");
const submitButton = document.querySelector("#submit");
const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close")[0];

form.addEventListener('submit', e => {
  submitButton.disabled = true;
  e.preventDefault();
  let requestBody = new FormData(form); fetch('https://script.google.com/macros/s/AKfycbxbPqP15KDrCXagGpCt7uyjbbsn8SrGX3fkw-ZPmUGut16IRUihC-dPjV21L0wkSDfL/exec', { method: 'POST', body: requestBody })
    .then(response => {
      if (response.ok) {
        modal.style.display = "block";
      } else {
        throw new Error('Network response was not ok.');
      }
      submitButton.disabled = false;
    })
    .catch(error => {
      alert('Error! Unable to submit your data. Please try again later.');
      console.error('Error:', error);
      submitButton.disabled = false;
    });
});

// Close the modal when user clicks on close button
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Close the modal when user clicks anywhere outside of the modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
	document.addEventListener("keydown", e => {
  // USE THIS TO DISABLE CONTROL AND ALL FUNCTION KEYS
  // if (e.ctrlKey || (e.keyCode>=112 && e.keyCode<=123)) {
  // THIS WILL ONLY DISABLE CONTROL AND F12
  if (e.ctrlKey || e.keyCode==123) {
    e.stopPropagation();
    e.preventDefault();
  }
});

document.addEventListener("contextmenu", e => e.preventDefault(), false);
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amountToPay');
const noteInput = document.getElementById('note');
const payNowButton = document.getElementById('payNowButton');
const showQRButton = document.getElementById('showQRButton');
const qrCodeModal = document.getElementById('qrCodeModal');
const modalClose = document.querySelector('.modal-close');
payNowButton.addEventListener('click', () => {
	if(validateForm()) {
		const enteredName = nameInput.value;
		const enteredAmount = amountInput.value;
		const enteredNote = noteInput.value;
		// Construct the payment link
		const paymentLink = `upi://pay?pa=aryan9356@ybl&am=${enteredAmount}&tn=Paid by ${enteredName} with note ${enteredNote}`;
		// Redirect the user to the payment link
		window.location.href = paymentLink;
	}
});
showQRButton.addEventListener('click', () => {
	if(validateForm()) {
		const enteredName = nameInput.value;
		const enteredAmount = amountInput.value;
		const enteredNote = noteInput.value;
		// Construct the payment link
		const paymentLink = `upi://pay?pa=aryan9356@ybl&am=${enteredAmount}&tn=Paid by ${enteredName} with note ${enteredNote}`;
		// Construct the QR code
		const paymentQR = `https://quickchart.io/qr?text=${encodeURIComponent(paymentLink)}`;
		// Set the src attribute of the QR code image
		document.getElementById('paymentQRCode').src = paymentQR;
		// Set the payment amount in the modal
		document.getElementById('paymentAmount').textContent = `Amount: ${enteredAmount}`;
		// Show the modal
		qrCodeModal.style.display = 'block';
	}
});
modalClose.addEventListener('click', () => {
	qrCodeModal.style.display = 'none';
});
window.addEventListener('click', (event) => {
	if(event.target == qrCodeModal) {
		qrCodeModal.style.display = 'none';
	}
});

function validateForm() {
    const amountInput = document.getElementById('amountToPay');
    const amountErrorMessage = document.getElementById('amountErrorMessage');

    if (amountInput.checkValidity()) {
        // If input is valid, remove error message and styling
        amountErrorMessage.textContent = ''; // Clear error message
        amountInput.classList.remove('invalid'); // Remove invalid styling
        return true;
    } else {
        // If input is invalid, show error message and apply styling
        amountErrorMessage.textContent = "Amount cannot be empty"; // Set error message
        amountInput.classList.add('invalid'); // Apply invalid styling
        return false;
    }
}