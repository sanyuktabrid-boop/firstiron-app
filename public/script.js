// WhatsApp Booking
function orderNow() {
  const number = "918879347028";
  const message = "Hello FirstIron, I want to book a laundry pickup. Please contact me.";
  const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
}

// Website Booking Form
async function submitForm(event) {
  event.preventDefault(); // Stop page reload

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;
  const statusDisplay = document.getElementById("status"); // Reference to the status message element

  if (!name || !phone || !service) {
    statusDisplay.innerText = "Please fill all required fields.";
    statusDisplay.style.color = "red";
    return;
  }

  const data = {
    name,
    email,
    phone,
    service
  };

  try {
    const response = await fetch("/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    // Show success message on the page instead of an alert
    statusDisplay.innerText = "Booking submitted successfully!";
    statusDisplay.style.color = "green";

    console.log(result);

    // Clear form
    document.getElementById("contactForm").reset();

  } catch (error) {
    console.error(error);
    statusDisplay.innerText = "Error submitting booking. Please try again.";
    statusDisplay.style.color = "red";
  }
}