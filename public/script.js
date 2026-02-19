// ================= FORCE HIDE LOGIN =================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginSection").style.display = "none";
});

// ================= WHATSAPP =================
function orderNow() {
  window.open("https://wa.me/918879347028");
}

// ================= BOOKING =================
async function submitForm(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("service").value;
  const status = document.getElementById("status");

  await fetch("http://localhost:8080/book", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, phone, service })
  });

  status.innerText = "Booking Done! Check your email to confirm.";
}

// ================= LOGIN =================
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("loginStatus");

  if (username === "admin" && password === "admin123") {
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("loginSection").style.display = "none";
    status.innerText = "";
  } else {
    status.innerText = "Onlyowner can access";
    status.style.color = "red";
  }
}

// ================= SHOW LOGIN =================
function showLogin() {
  document.getElementById("loginSection").style.display = "block";
}

// ================= ADMIN ACTIONS =================
async function markDelivery() {
  const status = document.getElementById("adminStatus");

  await fetch("/delivery-done", { method: "POST" });
  status.innerText = "Delivery sent";
}

async function markPayment() {
  const status = document.getElementById("adminStatus");

  await fetch("/payment-done", { method: "POST" });
  status.innerText = "Payment sent";
}

async function sendReminder() {
  const status = document.getElementById("adminStatus");

  await fetch("/balance-reminder", { method: "POST" });
  status.innerText = "Reminder sent";
}