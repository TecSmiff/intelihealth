// === FIND CARE DIRECTORY ===
const providers = [
  { name: "City Clinic", type: "Hospital", location: "Port Louis", contact: "210 5000" },
  { name: "Curepipe Family Clinic", type: "General Practice", location: "Curepipe", contact: "675 3322" },
  { name: "VisionCare Clinic", type: "Eye Specialist", location: "Quatre Bornes", contact: "427 4500" },
  { name: "Port Louis Dental Centre", type: "Dental Clinic", location: "Port Louis", contact: "210 7788" },
  { name: "Apollo Bramwell Hospital", type: "Private Hospital", location: "Moka", contact: "605 1000" },
  { name: "Dr. A. G. Jeetoo Hospital", type: "Public Hospital", location: "Port Louis", contact: "208 1240" },
  { name: "Victoria Hospital", type: "Public Hospital", location: "Candos", contact: "601 2200" },
  { name: "Brown Séquard Hospital", type: "Neurology", location: "Beau Bassin", contact: "424 0441" }
];

const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const matches = providers.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query)
    );

    resultsDiv.innerHTML = matches.length
      ? matches.map(p => `
        <div class="card">
          <h3>${p.name}</h3>
          <p><strong>Type:</strong> ${p.type}</p>
          <p><strong>Location:</strong> ${p.location}</p>
          <p><strong>Contact:</strong> ${p.contact}</p>
        </div>
      `).join("")
      : "<p>No matching providers found.</p>";
  });
}

// Chatbot toggle
const chatbotIcon = document.getElementById("chatbot-icon");
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const chatBody = document.getElementById("chat-body");

if (chatbotIcon && chatWindow) {
  chatbotIcon.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");
  });

  // Basic chatbot responses
  function getBotResponse(input) {
    input = input.toLowerCase();

    if (input.includes("hello") || input.includes("hi")) {
      return "Hello! 👋 How can I assist you with healthcare today?";
    } else if (input.includes("dentist")) {
      return "You can visit the nearest dental clinic — like Port Louis Dental Centre.";
    } else if (input.includes("eye")) {
      return "For eye specialists, try VisionCare Clinic in Quatre Bornes.";
    } else if (input.includes("flu") || input.includes("cold")) {
      return "For flu or general illness, book a consultation with a GP at Curepipe Family Clinic.";
    } else if (input.includes("hospital")) {
      return "Closest hospitals include Candos Hospital and City Clinic. Would you like directions?";
    } else if (input.includes("virtual") || input.includes("online")) {
      return "Yes, we offer virtual consultations! You can request one through our Find Care page.";
    } else {
      return "I'm still learning 🤖 — please try asking about a service, clinic, or condition.";
    }
  }

  // Send message
  if (userInput && chatBody) {
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && userInput.value.trim() !== "") {
        const userMessage = userInput.value;
        appendMessage(userMessage, "user");
        const botResponse = getBotResponse(userMessage);
        setTimeout(() => appendMessage(botResponse, "bot"), 500);
        userInput.value = "";
      }
    });

    function appendMessage(message, sender) {
      const msgDiv = document.createElement("div");
      msgDiv.classList.add("message", sender);
      msgDiv.textContent = message;
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
}

// === CONSULTATION FORM HANDLER ===
const consultForm = document.getElementById("consultForm");

if (consultForm) {
  consultForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formMessage = document.getElementById("formMessage");
    if (formMessage) {
      formMessage.textContent = "✅ Request submitted! We'll contact you shortly.";
    }
    consultForm.reset();
  });
}

// Book appointment buttons
document.addEventListener('DOMContentLoaded', function() {
  const bookButtons = document.querySelectorAll('.book-btn');
  bookButtons.forEach(button => {
    button.addEventListener('click', function() {
      const facilityName = this.parentElement.querySelector('h3').textContent;
      alert(`Booking appointment at: ${facilityName}\n\nThis would redirect to the booking system in a real application.`);
    });
  });
});
