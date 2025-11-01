// === FIND CARE DIRECTORY ===
async function loadProviders() {
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSnDf8MPAfU_FoduKaYtpXuvCP5uSFl5cLxCMPQEUVnjjei3sCf-cqO-qwDobfFR1pKA0xEk5GgIKL1/pub?gid=0&single=true&output=csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    const providers = rows.map(row => {
      const [name, type, location, contact] = row.split(',');
      return { name, type, location, contact };
    });
    return providers;
  } catch (error) {
    console.error('Error loading providers:', error);
    // Fallback to hardcoded data if Google Sheets fails
    return [
      { name: "City Clinic", type: "Hospital", location: "Port Louis", contact: "210 5000" },
      { name: "Curepipe Family Clinic", type: "General Practice", location: "Curepipe", contact: "675 3322" },
      { name: "VisionCare Clinic", type: "Eye Specialist", location: "Quatre Bornes", contact: "427 4500" },
      { name: "Port Louis Dental Centre", type: "Dental Clinic", location: "Port Louis", contact: "210 7788" },
      { name: "Apollo Bramwell Hospital", type: "Private Hospital", location: "Moka", contact: "605 1000" }
    ];
  }
}

// Initialize search functionality
loadProviders().then(providers => {
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");

  if (searchInput && resultsDiv) {
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
});

// Chatbot toggle
const chatbotIcon = document.getElementById("chatbot-icon");
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const chatBody = document.getElementById("chat-body");

if (chatbotIcon && chatWindow) {
  chatbotIcon.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");
  });

  // Enhanced chatbot responses
  function getBotResponse(input) {
    input = input.toLowerCase();
    
    const responses = {
      greetings: [
        "Hello 👋 How can I help you find care today?",
        "Hi there! Need help finding a clinic or booking a consultation?",
        "Hey! I'm here to guide you to the right healthcare service."
      ],
      dental: [
        "Need dental care? You can check Port Louis Dental Centre or SmileBright Clinic.",
        "For dental issues, I recommend seeing a general dentist or orthodontist nearby."
      ],
      hospital: [
        "Hospitals nearby include Apollo Bramwell (Moka) and City Clinic (Port Louis).",
        "You can use the Find Care page to locate hospitals near your area."
      ],
      flu: [
        "For flu or fever, book a GP visit or request a virtual consultation.",
        "Try home rest, hydration, and see a doctor if symptoms persist."
      ],
      eye: [
        "For eye care, try VisionCare Clinic in Quatre Bornes or the Eye Hospital in Pamplemousses.",
        "Eye specialists are available at several clinics - check our Find Care page for options."
      ],
      emergency: [
        "For emergencies, call SAMU at 114 immediately!",
        "Emergency services are available 24/7 - call 114 for urgent medical assistance."
      ],
      appointment: [
        "You can book appointments through our platform - just visit the Find Care page!",
        "To book an appointment, find your preferred provider and click 'Book Appointment'."
      ]
    };

    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) return random(responses.greetings);
    if (input.includes("dentist") || input.includes("tooth") || input.includes("dental")) return random(responses.dental);
    if (input.includes("hospital") || input.includes("clinic") || input.includes("medical")) return random(responses.hospital);
    if (input.includes("flu") || input.includes("fever") || input.includes("cold")) return random(responses.flu);
    if (input.includes("eye") || input.includes("vision") || input.includes("see")) return random(responses.eye);
    if (input.includes("emergency") || input.includes("urgent") || input.includes("help")) return random(responses.emergency);
    if (input.includes("appointment") || input.includes("book") || input.includes("schedule")) return random(responses.appointment);

    return "I'm still learning 🤖 — try asking about a specific service or location.";
  }

  function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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
