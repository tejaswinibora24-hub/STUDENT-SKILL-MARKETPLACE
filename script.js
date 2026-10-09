"use strict";

const skills = [
  {
    id: 1,
    name: "Web Development",
    category: "Technology",
    icon: "💻",
    duration: "4 weeks",
    level: "Beginner",
    description: "Learn HTML, CSS and JavaScript.",
    topics: ["HTML", "CSS", "JavaScript", "Website Project"]
  },
  {
    id: 2,
    name: "Python Programming",
    category: "Technology",
    icon: "🐍",
    duration: "5 weeks",
    level: "Beginner",
    description: "Learn programming using Python.",
    topics: ["Variables", "Loops", "Functions", "Mini Project"]
  },
  {
    id: 3,
    name: "Graphic Design",
    category: "Design",
    icon: "🎨",
    duration: "3 weeks",
    level: "Beginner",
    description: "Learn creative graphic design.",
    topics: ["Colours", "Typography", "Posters", "Portfolio"]
  },
  {
    id: 4,
    name: "UI/UX Design",
    category: "Design",
    icon: "📱",
    duration: "4 weeks",
    level: "Beginner",
    description: "Design user-friendly applications.",
    topics: ["Research", "Wireframes", "Prototypes", "Testing"]
  },
  {
    id: 5,
    name: "Digital Marketing",
    category: "Business",
    icon: "📈",
    duration: "4 weeks",
    level: "Beginner",
    description: "Learn online marketing basics.",
    topics: ["Social Media", "SEO", "Content", "Analytics"]
  },
  {
    id: 6,
    name: "Communication Skills",
    category: "Personal Growth",
    icon: "🗣️",
    duration: "2 weeks",
    level: "All Levels",
    description: "Improve speaking and presentation skills.",
    topics: ["Speaking", "Listening", "Presentation", "Interviews"]
  },
  {
    id: 7,
    name: "Excel & Data Skills",
    category: "Technology",
    icon: "📊",
    duration: "3 weeks",
    level: "Beginner",
    description: "Learn spreadsheets and data organization.",
    topics: ["Tables", "Formulas", "Charts", "Data"]
  },
  {
    id: 8,
    name: "Entrepreneurship",
    category: "Business",
    icon: "🚀",
    duration: "3 weeks",
    level: "Beginner",
    description: "Learn how to plan a business idea.",
    topics: ["Ideas", "Planning", "Budget", "Pitching"]
  }
];

function loadData(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    alert("Data could not be saved in this browser.");
    return false;
  }
}

let student = loadData("studentProfile", null);
let bookings = loadData("studentBookings", []);
let selectedSkillId = null;

function showPage(id) {
  const target = document.getElementById(id);

  if (!target) return;

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  target.classList.add("active");

  if (id === "skills") renderSkills();
  if (id === "dashboard") renderDashboard();

  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", function () {
    showPage(this.dataset.page);
  });
});

document.getElementById("startBtn").addEventListener("click", function () {
  showPage(student ? "skills" : "register");
});

function todayISO() {
  const date = new Date();

  return date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0");
}

function calculateAge(dateString) {
  const birthDate = new Date(dateString + "T00:00:00");
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (
      today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
}

function setMessage(id, text, isError = false) {
  const element = document.getElementById(id);
  element.textContent = text;
  element.className = "message " + (isError ? "error" : "success");
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

/* DOB validation */
const dobInput = document.getElementById("dob");
dobInput.max = todayISO();

/* Registration */
document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const dob = dobInput.value;
  const course = document.getElementById("course").value.trim();
  const password = document.getElementById("password").value;

  if (!/^[0-9]{10}$/.test(mobile)) {
    setMessage("registerMessage", "Enter a valid 10-digit mobile number.", true);
    return;
  }

  if (!dob || dob > todayISO()) {
    setMessage("registerMessage", "Enter a valid date of birth.", true);
    return;
  }

  if (calculateAge(dob) < 18) {
    setMessage("registerMessage", "You must be at least 18 years old.", true);
    return;
  }

  if (password.length < 6) {
    setMessage("registerMessage", "Password must have at least 6 characters.", true);
    return;
  }

  student = { name, email, mobile, dob, course };

  if (!saveData("studentProfile", student)) return;

  document.getElementById("welcomeMessage").textContent =
    "Welcome, " + name + "! Your registration is successful.";

  this.reset();
  dobInput.max = todayISO();

  showPage("registered");
});

/* Skill search and category filter */
function renderSkills() {
  const query = document.getElementById("skillSearch").value.toLowerCase().trim();
  const category = document.getElementById("categoryFilter").value;

  const results = skills.filter(skill => {
    const text = (
      skill.name + " " + skill.category + " " + skill.description
    ).toLowerCase();

    return text.includes(query) &&
      (category === "All" || skill.category === category);
  });

  const grid = document.getElementById("skillsGrid");
  grid.replaceChildren();

  document.getElementById("noSkills").hidden = results.length > 0;

  results.forEach(skill => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="emoji">${skill.icon}</div>
      <span class="tag">${safeText(skill.category)}</span>
      <h3>${safeText(skill.name)}</h3>
      <p>${safeText(skill.description)}</p>
      <p><strong>${safeText(skill.duration)}</strong></p>
      <button class="primary" type="button">View Details</button>
    `;

    card.querySelector("button").addEventListener("click", function () {
      openSkill(skill.id);
    });

    grid.appendChild(card);
  });
}

document.getElementById("skillSearch").addEventListener("input", renderSkills);
document.getElementById("categoryFilter").addEventListener("change", renderSkills);

/* Selected skill details */
function openSkill(id) {
  const skill = skills.find(item => item.id === id);
  if (!skill) return;

  selectedSkillId = id;

  document.getElementById("skillDetailsContent").innerHTML = `
    <article class="detail-panel">
      <div class="big-emoji">${skill.icon}</div>
      <span class="tag">${safeText(skill.category)}</span>
      <h1>${safeText(skill.name)}</h1>
      <p>${safeText(skill.description)}</p>
      <p><strong>Level:</strong> ${safeText(skill.level)}</p>
      <p><strong>Duration:</strong> ${safeText(skill.duration)}</p>
      <button id="bookSkillBtn" class="primary" type="button">
        Book This Skill
      </button>
    </article>

    <article class="detail-panel">
      <h2>What You Will Learn</h2>
      <ul class="topic-list">
        ${skill.topics.map(topic => `<li>${safeText(topic)}</li>`).join("")}
      </ul>
    </article>
  `;

  document.getElementById("bookSkillBtn").addEventListener("click", bookSelectedSkill);

  showPage("skillDetails");
}

/* Booking form */
function bookSelectedSkill() {
  const skill = skills.find(item => item.id === selectedSkillId);

  if (!skill) {
    showPage("skills");
    return;
  }

  document.getElementById("bookingSkill").value = skill.name;
  document.getElementById("bookingStudent").value = student ? student.name : "";

  const dateInput = document.getElementById("bookingDate");
  dateInput.min = todayISO();
  dateInput.value = todayISO();

  document.getElementById("bookingMessage").textContent = "";

  showPage("booking");
}

document.getElementById("bookingForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("bookingStudent").value.trim();
  const skill = document.getElementById("bookingSkill").value;
  const date = document.getElementById("bookingDate").value;
  const mode = document.getElementById("learningMode").value;
  const details = document.getElementById("bookingDetails").value.trim();

  if (!name || !skill || !date || !mode) {
    setMessage("bookingMessage", "Please complete all required fields.", true);
    return;
  }

  if (date < todayISO()) {
    setMessage("bookingMessage", "Choose today or a future date.", true);
    return;
  }

  const booking = {
    id: Date.now(),
    name,
    skill,
    date,
    mode,
    details,
    status: "Confirmed"
  };

  bookings.push(booking);

  if (!saveData("studentBookings", bookings)) return;

  this.reset();

  alert("Booking confirmed successfully!");
  showPage("dashboard");
});

/* Dashboard */
function renderDashboard() {
  const profile = document.getElementById("profilePanel");

  if (student) {
    profile.innerHTML = `
      <h2>Welcome, ${safeText(student.name)} 👋</h2>
      <p><strong>Email:</strong> ${safeText(student.email)}</p>
      <p><strong>Mobile:</strong> ${safeText(student.mobile)}</p>
      <p><strong>Date of Birth:</strong> ${safeText(student.dob)}</p>
      <p><strong>Course:</strong> ${safeText(student.course)}</p>
    `;
  } else {
    profile.innerHTML = `
      <h2>Welcome, Student!</h2>
      <p>Please register to create your profile.</p>
      <button id="dashboardRegister" class="primary" type="button">
        Register Now
      </button>
    `;

    document.getElementById("dashboardRegister").addEventListener("click", function () {
      showPage("register");
    });
  }

  const list = document.getElementById("bookingsList");
  list.replaceChildren();

  if (bookings.length === 0) {
    list.innerHTML = '<div class="empty-state">No bookings yet. Select a skill to begin.</div>';
    return;
  }

  [...bookings].reverse().forEach(booking => {
    const item = document.createElement("article");
    item.className = "booking-item";

    item.innerHTML = `
      <h3>${safeText(booking.skill)}</h3>
      <p><strong>Student:</strong> ${safeText(booking.name)}</p>
      <p><strong>Date:</strong> ${safeText(booking.date)}</p>
      <p><strong>Mode:</strong> ${safeText(booking.mode)}</p>
      <p><strong>Status:</strong> ${safeText(booking.status)}</p>
      <p>${safeText(booking.details)}</p>
      <button class="danger" type="button">Cancel Booking</button>
    `;

    item.querySelector("button").addEventListener("click", function () {
      cancelBooking(booking.id);
    });

    list.appendChild(item);
  });
}

function cancelBooking(id) {
  if (!confirm("Do you want to cancel this booking?")) return;

  bookings = bookings.filter(booking => booking.id !== id);

  if (saveData("studentBookings", bookings)) {
    renderDashboard();
  }
}

document.getElementById("logoutBtn").addEventListener("click", function () {
  if (!confirm("Are you sure you want to log out?")) return;

  student = null;
  localStorage.removeItem("studentProfile");

  showPage("home");
});

/* Feedback */
document.getElementById("feedbackForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("feedbackName").value.trim();
  const rating = document.getElementById("rating").value;
  const comments = document.getElementById("comments").value.trim();

  if (!name || !rating || comments.length < 3) {
    setMessage("feedbackMessage", "Please complete all fields.", true);
    return;
  }

  const feedback = loadData("studentFeedback", []);

  feedback.push({
    name,
    rating,
    comments,
    date: todayISO()
  });

  if (!saveData("studentFeedback", feedback)) return;

  this.reset();
  showPage("thanks");
});

/* Initial display */
renderSkills();
renderDashboard();