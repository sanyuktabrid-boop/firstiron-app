// WhatsApp Booking
function orderNow() {

  let number = "918879347028";

  let message =
    "Hello FirstIron, I want to book a laundry pickup. Please contact me.";

  let url =
    "https://wa.me/" + number + "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
}


// Website Booking Form
async function submitForm(event) {

  event.preventDefault(); // stop page reload

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;

  if (!name || !phone || !service) {
    alert("Please fill all required fields");
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

    alert("Booking submitted successfully!");

    console.log(result);

    // Optional: clear form
    document.getElementById("contactForm").reset();

  } catch (error) {

    console.error(error);

    alert("Error submitting booking");

  }
}