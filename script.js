// Smart Search Logic for Find Care Page
const services = [
  { keyword: "dentist", result: "Nearest Dental Clinic – Port Louis Dental Centre" },
  { keyword: "flu", result: "General Practitioner – Curepipe Family Clinic" },
  { keyword: "eye", result: "Eye Specialist – VisionCare Clinic, Quatre Bornes" },
  { keyword: "skin", result: "Dermatologist – Beau Bassin Skin Clinic" },
  { keyword: "heart", result: "Cardiologist – Apollo Bramwell Hospital" },
  { keyword: "emergency", result: "Emergency Department – Candos Hospital" },
  { keyword: "doctor", result: "General Practitioner – WellCare Medical Centre" },
  { keyword: "clinic", result: "Primary Care Clinic – Floreal Medical Center" },
  { keyword: "hospital", result: "Multi-specialty Hospital – Clinique Darné" },
  { keyword: "pediatric", result: "Child Specialist – Pediatric Care Mauritius" },
  { keyword: "children", result: "Pediatrician – Kids Health Mauritius" },
  { keyword: "woman", result: "Gynecologist – Women's Health Centre" },
  { keyword: "pregnancy", result: "Obstetrician – Mother & Child Clinic" },
  { keyword: "bone", result: "Orthopedic Specialist – Bone & Joint Clinic" },
  { keyword: "surgery", result: "Surgical Department – Apollo Bramwell" },
  { keyword: "mental", result: "Psychiatrist – Mental Wellness Centre" },
  { keyword: "therapy", result: "Physical Therapist – Rehabilitation Center" },
  { keyword: "xray", result: "Radiology Department – Imaging Centre Mauritius" },
  { keyword: "test", result: "Diagnostic Lab – Medical Laboratory Services" },
  { keyword: "blood", result: "Pathology Lab – Blood Test Center" },
];

// Chatbot functionality
function initializeChatbot() {
  const chatbotIcon = document.getElementById('chatbot-icon');
  const chatWindow = document.getElementById('chat-window');
  const userInput = document.getElementById('user-input');
  const chatBody = document.getElementById('chat-body');

  if (chatbotIcon && chatWindow && userInput && chatBody) {
    // Toggle chat window
    chatbotIcon.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
      if (!chatWindow.classList.contains('hidden')) {
        userInput.focus();
        // Add welcome message if chat is empty
        if (chatBody.children.length === 0) {
          addBotMessage("Hello! I'm your InteliHealth assistant. How can I help you with healthcare in Mauritius today?");
        }
      }
    });

    // Handle user input
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && userInput.value.trim()) {
        const userMessage = userInput.value.trim();
        addUserMessage(userMessage);
        userInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
          const botResponse = generateBotResponse(userMessage);
          addBotMessage(botResponse);
        }, 1000);
      }
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
      if (!chatbotIcon.contains(e.target) && !chatWindow.contains(e.target)) {
        chatWindow.classList.add('hidden');
      }
    });
  }
}

function addUserMessage(message) {
  const chatBody = document.getElementById('chat-body');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message user-message';
  messageDiv.textContent = message;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(message) {
  const chatBody = document.getElementById('chat-body');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message bot-message';
  messageDiv.textContent = message;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function generateBotResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm here to help you find healthcare services in Mauritius. What do you need help with?";
  } else if (lowerMessage.includes('doctor') || lowerMessage.includes('physician')) {
    return "I can help you find doctors in Mauritius. Try searching for a specific specialty like 'dentist', 'cardiologist', or 'pediatrician' on our Find Care page.";
  } else if (lowerMessage.includes('hospital') || lowerMessage.includes('clinic')) {
    return "We have information on all major hospitals and clinics in Mauritius. Check our Find Care page for locations, contact details, and services.";
  } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
    return "For emergencies, call SAMU at 114 immediately. They provide 24/7 emergency medical assistance across Mauritius.";
  } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
    return "You can book appointments directly through our platform. Visit the Find Care page, select a healthcare provider, and click 'Book Appointment'.";
  } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
    return "Healthcare costs vary by provider and service. I recommend contacting the specific clinic or hospital directly for accurate pricing information.";
  } else if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('address')) {
    return "We have healthcare providers across all regions of Mauritius. Use our search on the Find Care page to find providers near your location.";
  } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return "You're welcome! Is there anything else I can help you with regarding healthcare in Mauritius?";
  } else {
    return "I'm here to help you navigate healthcare in Mauritius. You can ask me about finding doctors, hospitals, booking appointments, or emergency services. For detailed searches, visit our Find Care page.";
  }
}

// Search functionality
function initializeSearch() {
  const input = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");

  if (input && suggestions) {
    input.addEventListener("input", () => {
      const query = input.value.toLowerCase();
      suggestions.innerHTML = "";

      if (query.length > 1) {
        const matches = services.filter(service =>
          service.keyword.includes(query)
        );

        if (matches.length > 0) {
          matches.forEach(match => {
            const li = document.createElement("li");
            li.textContent = match.result;
            li.style.cursor = "pointer";
            li.style.padding = "12px 15px";
            li.style.borderBottom = "1px solid #eee";
            li.style.transition = "all 0.2s ease";
            
            li.addEventListener("mouseenter", () => {
              li.style.background = "#f8f9fa";
              li.style.color = "#007bff";
            });
            
            li.addEventListener("mouseleave", () => {
              li.style.background = "white";
              li.style.color = "inherit";
            });
            
            li.addEventListener("click", () => {
              input.value = match.result;
              suggestions.innerHTML = "";
              suggestions.style.display = "none";
              showSearchResult(match);
            });
            
            suggestions.appendChild(li);
          });
        } else {
          const li = document.createElement("li");
          li.textContent = "No matches found. Try: dentist, flu, eye, skin, heart, emergency";
          li.style.padding = "12px 15px";
          li.style.color = "#6c757d";
          li.style.fontStyle = "italic";
          suggestions.appendChild(li);
        }
        
        // Show suggestions container
        suggestions.style.display = "block";
      } else {
        suggestions.style.display = "none";
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.style.display = "none";
      }
    });

    // Handle Enter key press
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch(input.value);
        suggestions.style.display = "none";
      }
    });
  }
}

function performSearch(query) {
  const matches = services.filter(service =>
    service.keyword.includes(query.toLowerCase()) || 
    service.result.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length > 0) {
    showSearchResult(matches[0]);
  } else {
    alert(`No healthcare providers found for "${query}". Try searching for: dentist, doctor, clinic, hospital, or specific symptoms.`);
  }
}

function showSearchResult(match) {
  alert(`🔍 Search Result:\n\n${match.result}\n\nThis would show detailed information and booking options in the full application.`);
}

// Home page search function
function search() {
  const term = document.getElementById("search");
  if (term) {
    const searchTerm = term.value;
    if (searchTerm) {
      window.location.href = `findcare.html?search=${encodeURIComponent(searchTerm)}`;
    } else {
      window.location.href = 'findcare.html';
    }
  }
}

// Handle URL parameters for pre-filled search
function handleUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  
  if (searchParam && document.getElementById('searchInput')) {
    document.getElementById('searchInput').value = searchParam;
    performSearch(searchParam);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeChatbot();
  initializeSearch();
  
  // Add functionality to the book appointment buttons
  document.querySelectorAll('.book-btn').forEach(button => {
    button.addEventListener('click', function() {
      const facilityName = this.parentElement.querySelector('h3').textContent;
      const facilityType = this.parentElement.querySelector('.facility-type')?.textContent || 'Healthcare Facility';
      alert(`Booking appointment at: ${facilityName}\nType: ${facilityType}\n\nThis would redirect to the booking system in a real application.`);
    });
  });

  // Handle URL parameters for findcare page
  if (window.location.pathname.includes('findcare.html')) {
    handleUrlParameters();
  }
});
