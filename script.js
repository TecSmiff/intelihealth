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
              // Scroll to results or show detailed view
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
    // Show first match or all matches
    showSearchResult(matches[0]);
  } else {
    alert(`No healthcare providers found for "${query}". Try searching for: dentist, doctor, clinic, hospital, or specific symptoms.`);
  }
}

function showSearchResult(match) {
  // Create a modal or highlight the relevant section
  alert(`🔍 Search Result:\n\n${match.result}\n\nThis would show detailed information and booking options in the full application.`);
  
  // In a real application, you would:
  // 1. Filter and highlight relevant facilities
  // 2. Show a detailed view
  // 3. Provide booking options
  // 4. Scroll to the relevant section
}

// Home page search function (if needed)
function search() {
  const term = document.getElementById("search");
  if (term) {
    const searchTerm = term.value;
    if (searchTerm) {
      // Redirect to findcare page with search parameter
      window.location.href = `findcare.html?search=${encodeURIComponent(searchTerm)}`;
    } else {
      window.location.href = 'findcare.html';
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
  
  // Add functionality to the book appointment buttons
  document.querySelectorAll('.book-btn').forEach(button => {
    button.addEventListener('click', function() {
      const facilityName = this.parentElement.querySelector('h3').textContent;
      const facilityType = this.parentElement.querySelector('.facility-type')?.textContent || 'Healthcare Facility';
      alert(`Booking appointment at: ${facilityName}\nType: ${facilityType}\n\nThis would redirect to the booking system in a real application.`);
    });
  });
});

// Handle URL parameters for pre-filled search
function handleUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  
  if (searchParam && document.getElementById('searchInput')) {
    document.getElementById('searchInput').value = searchParam;
    performSearch(searchParam);
  }
}

// Call this when the page loads for findcare.html
if (window.location.pathname.includes('findcare.html')) {
  document.addEventListener('DOMContentLoaded', handleUrlParameters);
}
