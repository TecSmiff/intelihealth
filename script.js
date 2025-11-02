// === FIND CARE DIRECTORY ===
async function loadProviders() {
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSnDf8MPAfU_FoduKaYtpXuvCP5uSFl5cLxCMPQEUVnjjei3sCf-cqO-qwDobfFR1pKA0xEk5GgIKL1/pub?gid=0&single=true&output=csv');
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.text();
    const rows = data.split('\n').slice(1).filter(row => row.trim());
    
    const providers = rows.map(row => {
      const [name, type, location, contact] = row.split(',').map(field => field.trim());
      return { name, type, location, contact };
    }).filter(provider => provider.name && provider.type);
    
    return providers;
  } catch (error) {
    console.error('Error loading providers:', error);
    // Fallback data
    return [
      { name: "City Clinic", type: "Hospital", location: "Port Louis", contact: "210 5000" },
      { name: "Curepipe Family Clinic", type: "General Practice", location: "Curepipe", contact: "675 3322" },
      { name: "VisionCare Clinic", type: "Eye Specialist", location: "Quatre Bornes", contact: "427 4500" },
      { name: "Port Louis Dental Centre", type: "Dental Clinic", location: "Port Louis", contact: "210 7788" },
      { name: "Apollo Bramwell Hospital", type: "Private Hospital", location: "Moka", contact: "605 1000" }
    ];
  }
}

// Initialize search functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
  initializeChatbot();
  initializeBookingButtons();
});

// Search functionality
async function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");

  if (!searchInput || !resultsDiv) return;

  try {
    const providers = await loadProviders();
    
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();
      
      if (query.length < 2) {
        resultsDiv.innerHTML = "";
        return;
      }

      const matches = providers.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      );

      displaySearchResults(matches, resultsDiv);
    });

    // Show initial message
    resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">Start typing to search for healthcare providers...</p>';
    
  } catch (error) {
    console.error('Search initialization failed:', error);
    resultsDiv.innerHTML = '<p style="text-align: center; color: #dc3545;">Unable to load providers. Please try again later.</p>';
  }
}

function displaySearchResults(matches, container) {
  if (matches.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666;">No matching providers found. Try different keywords.</p>';
    return;
  }

  container.innerHTML = matches.map(provider => `
    <div class="search-card">
      <h3>${provider.name}</h3>
      <p><strong>Type:</strong> ${provider.type}</p>
      <p><strong>Location:</strong> ${provider.location}</p>
      <p><strong>Contact:</strong> ${provider.contact}</p>
    </div>
  `).join("");
}

// Chatbot functionality
function initializeChatbot() {
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatWindow = document.getElementById("chat-window");
  const userInput = document.getElementById("user-input");
  const chatBody = document.getElementById("chat-body");

  if (!chatbotIcon || !chatWindow) return;

  chatbotIcon.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");
    if (!chatWindow.classList.contains('hidden')) {
      userInput?.focus();
      // Add welcome message if chat is empty
      if (chatBody && chatBody.children.length === 0) {
        setTimeout(() => {
          appendMessage("Hello! 👋 How can I help you find care today?", "bot", chatBody);
        }, 500);
      }
    }
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
        "For eye care, try VisionCare Clinic in Quatre Bornes or the Eye Hospital in Pamplemous
