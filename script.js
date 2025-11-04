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
    // Return empty array since we'll use HTML facilities as fallback
    return [];
  }
}

// Get facilities from HTML content
function getHTMLFacilities() {
  const facilityCards = document.querySelectorAll('.facility-card');
  const facilities = [];
  
  facilityCards.forEach(card => {
    const typeElement = card.querySelector('.facility-type');
    const nameElement = card.querySelector('h3');
    const contactInfo = card.querySelector('.contact-info');
    
    if (nameElement && contactInfo) {
      const type = typeElement ? typeElement.textContent.trim() : 'Medical Facility';
      const name = nameElement.textContent.trim();
      
      // Extract phone and address from contact info
      const phoneElement = Array.from(contactInfo.querySelectorAll('p')).find(p => 
        p.textContent.includes('Phone:') || p.textContent.includes('Phone:')
      );
      const addressElement = Array.from(contactInfo.querySelectorAll('p')).find(p => 
        p.textContent.includes('Address:') || p.textContent.includes('Address:')
      );
      const servicesElement = Array.from(contactInfo.querySelectorAll('p')).find(p => 
        p.textContent.includes('Services:') || p.textContent.includes('Services:')
      );
      
      const phone = phoneElement ? phoneElement.textContent.replace('Phone:', '').replace('Phone:', '').trim() : '';
      const address = addressElement ? addressElement.textContent.replace('Address:', '').replace('Address:', '').trim() : '';
      const services = servicesElement ? servicesElement.textContent.replace('Services:', '').replace('Services:', '').trim() : '';
      
      facilities.push({
        name,
        type,
        location: address,
        contact: phone,
        services: services
      });
    }
  });
  
  return facilities;
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
    const onlineProviders = await loadProviders();
    const htmlFacilities = getHTMLFacilities();
    
    // Combine both data sources
    const allProviders = [...onlineProviders, ...htmlFacilities];
    
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();
      
      if (query.length < 2) {
        resultsDiv.innerHTML = "<p style='text-align: center; color: #666;'>Start typing to search for healthcare providers...</p>";
        return;
      }

      const matches = allProviders.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        (p.services && p.services.toLowerCase().includes(query)) ||
        (p.contact && p.contact.toLowerCase().includes(query))
      );

      displaySearchResults(matches, resultsDiv);
    });

    // Show initial message
    resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">Start typing to search for healthcare providers...</p>';
    
  } catch (error) {
    console.error('Search initialization failed:', error);
    // Fallback to HTML facilities only
    const htmlFacilities = getHTMLFacilities();
    
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();
      
      if (query.length < 2) {
        resultsDiv.innerHTML = "<p style='text-align: center; color: #666;'>Start typing to search for healthcare providers...</p>";
        return;
      }

      const matches = htmlFacilities.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        (p.services && p.services.toLowerCase().includes(query)) ||
        (p.contact && p.contact.toLowerCase().includes(query))
      );

      displaySearchResults(matches, resultsDiv);
    });
    
    resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">Start typing to search for healthcare providers...</p>';
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
      ${provider.services ? `<p><strong>Services:</strong> ${provider.services}</p>` : ''}
    </div>
  `).join("");
}

// Booking buttons functionality
function initializeBookingButtons() {
  const bookingButtons = document.querySelectorAll('.book-btn');
  
  bookingButtons.forEach(button => {
    button.addEventListener('click', function() {
      const facilityCard = this.closest('.facility-card');
      const facilityName = facilityCard.querySelector('h3').textContent;
      
      // Show booking confirmation
      alert(`Booking appointment at ${facilityName}\n\nYou will be redirected to our booking system shortly.`);
      
      // Here you would typically redirect to a booking page or open a modal
      // For now, we'll just show an alert
    });
  });
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
          appendMessage("Hello! 👋 How can I help you find care today? I can help you search for hospitals, clinics, or specific medical services in Mauritius.", "bot", chatBody);
        }, 500);
      }
    }
  });

  // Handle user input
  if (userInput && chatBody) {
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const message = this.value.trim();
        if (message) {
          appendMessage(message, "user", chatBody);
          this.value = "";
          
          // Get AI bot response
          getBotResponse(message).then(botResponse => {
            appendMessage(botResponse, "bot", chatBody);
          });
        }
      }
    });
  }

  // AI-Powered chatbot responses using Hugging Face
  async function getBotResponse(input) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('AI chatbot error:', error);
      // Fallback to your existing smart responses
      return getFallbackBotResponse(input);
    }
  }

  // Keep your existing smart responses as fallback
  function getFallbackBotResponse(input) {
    input = input.toLowerCase();
    
    // Greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello 👋 How can I help you find care today? You can ask me about hospitals, clinics, or specific medical services in Mauritius.";
    }
    
    // Search related
    if (input.includes('search') || input.includes('find') || input.includes('look for')) {
      return "You can use the search bar above to find healthcare providers. Try searching by:\n• Hospital or clinic name\n• Medical specialty\n• Location (e.g., Port Louis, Curepipe)\n• Service needed";
    }
    
    // Medical specialties
    if (input.includes('dental') || input.includes('teeth') || input.includes('tooth')) {
      return "For dental care, I recommend:\n• Port Louis Dental Centre (210 7788)\n• Look for 'dental' in the search bar above\n• You can also request a virtual consultation for dental advice";
    }
    
    if (input.includes('eye') || input.includes('vision') || input.includes('ophthalm')) {
      return "For eye care, try:\n• VisionCare Clinic in Quatre Bornes (427 4500)\n• Search 'eye' or 'ophthalmology' above\n• Many hospitals have eye departments";
    }
    
    if (input.includes('heart') || input.includes('cardiac') || input.includes('cardiology')) {
      return "For heart-related issues:\n• Apollo Bramwell Hospital has excellent cardiac care (605 1000)\n• SSR National Hospital has cardiology services\n• Use the search bar for 'cardiology'";
    }
    
    if (input.includes('emergency') || input.includes('urgent')) {
      return "For emergencies:\n• Call 114 for ambulance\n• Go to nearest hospital emergency department\n• Victoria Hospital, Jeetoo Hospital, and Wellkin Hospital have 24/7 emergency services";
    }
    
    // Locations
    if (input.includes('port louis')) {
      return "In Port Louis area:\n• Dr. A. G. Jeetoo Hospital (208 1240)\n• Port Louis Dental Centre (210 7788)\n• City Clinic (210 5000)\n• Use search bar for more options in Port Louis";
    }
    
    if (input.includes('curepipe') || input.includes('floreal')) {
      return "In Curepipe/Floréal area:\n• Clinique Darné (601 2300)\n• Curepipe Family Clinic (675 3322)\n• Search above for more facilities in this region";
    }
    
    if (input.includes('moka') || input.includes('ebene')) {
      return "In Moka/Ebene area:\n• Apollo Bramwell Hospital (605 1000)\n• Wellkin Hospital (605 5500)\n• Urgences Médicales de l'Océan Indien (213 3333)";
    }
    
    // General health questions
    if (input.includes('flu') || input.includes('fever') || input.includes('cold')) {
      return "For flu-like symptoms:\n• Visit any general practitioner or family clinic\n• Rest and stay hydrated\n• Use virtual consultation for remote advice\n• If severe, visit emergency department";
    }
    
    if (input.includes('appointment') || input.includes('book') || input.includes('schedule')) {
      return "To book appointments:\n• Click the 'Book Appointment' button on any facility card\n• Call the facility directly using their phone number\n• Use our virtual consultation form for remote appointments";
    }
    
    // Default response
    return "I can help you find healthcare services in Mauritius. Try asking about:\n• Hospitals in specific areas\n• Medical specialties (dental, eye, heart, etc.)\n• Emergency services\n• Or use the search bar above to find specific providers";
  }

  function appendMessage(text, sender, container) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
  }
}

// Add this function to handle page navigation and re-initialization
function handlePageNavigation() {
  // Re-initialize search when navigating to findcare page
  if (window.location.pathname.includes('findcare.html') || 
      window.location.pathname.endsWith('findcare.html')) {
    setTimeout(initializeSearch, 100);
  }
}

// Listen for page navigation in single-page app style
window.addEventListener('popstate', handlePageNavigation);
document.addEventListener('DOMContentLoaded', handlePageNavigation);
