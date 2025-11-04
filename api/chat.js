export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'No message provided' });

    // Generate smart healthcare-focused responses
    let reply = generateSmartResponse(message);
    
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(200).json({ 
      reply: "Hello! I'm InteliHealth. I can help you find doctors, clinics, and healthcare services across Mauritius. What do you need help with today?" 
    });
  }
}

function generateSmartResponse(input) {
  input = input.toLowerCase();
  
  // Greetings
  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    return "Hello! 👋 I'm InteliHealth AI, your smart healthcare assistant for Mauritius. I can help you find doctors, clinics, hospitals, and medical services. What do you need help with today?";
  }
  
  // Dentist queries
  if (input.includes('dentist') || input.includes('teeth') || input.includes('dental') || input.includes('tooth')) {
    if (input.includes('port louis')) {
      return "I can help you find dental care in Port Louis! 🦷\n\nRecommended dentists:\n• Port Louis Dental Centre - 210 7788\n• SmileCare Dental Clinic - 210 4567\n• City Dental Practice - 211 8899\n\nYou can also use our Find Care page to search for more dentists near your location!";
    }
    return "I can help you find dental care across Mauritius! 🦷\n\nTop dental clinics:\n• Port Louis Dental Centre (Port Louis)\n• Curepipe Dental Clinic (Curepipe)  \n• SmileBright Dental (Grand Baie)\n• Quatre Bornes Dental Care\n\nTell me your area, or search 'dentist' on our Find Care page!";
  }
  
  // Emergency services
  if (input.includes('emergency') || input.includes('urgent') || input.includes('accident')) {
    return "For emergencies: 🚨\n\n• Call 114 for ambulance immediately\n• Nearest 24/7 emergency departments:\n  - Victoria Hospital (Candos)\n  - Jeetoo Hospital (Port Louis)\n  - Wellkin Hospital (Moka)\n  - Clinique Darné (Curepipe)\n\nGo to the nearest emergency department for urgent medical care!";
  }
  
  // Heart/cardiac care
  if (input.includes('heart') || input.includes('cardiac') || input.includes('cardiology')) {
    return "For cardiac care: ❤️\n\nSpecialized heart centers:\n• Apollo Bramwell Hospital - Advanced cardiac center (605 1000)\n• SSR National Hospital - Cardiology department\n• Victoria Hospital - Cardiac services\n\nI recommend contacting Apollo Bramwell for comprehensive cardiac care. Use our search to find cardiologists near you!";
  }
  
  // Eye care
  if (input.includes('eye') || input.includes('vision') || input.includes('ophthalm') || input.includes('optometrist')) {
    return "For eye care: 👁️\n\nRecommended providers:\n• VisionCare Clinic (Quatre Bornes) - 427 4500\n• Mauritius Eye Clinic (Port Louis)\n• SightPlus Optical (Curepipe)\n• Many hospitals have ophthalmology departments\n\nSearch 'eye' on our Find Care page for more options!";
  }
  
  // Location-specific queries
  if (input.includes('port louis')) {
    return "Healthcare in Port Louis: 🏙️\n\nMajor facilities:\n• Dr. A. G. Jeetoo Hospital (208 1240)\n• City Clinic (210 5000)\n• Port Louis Dental Centre (210 7788)\n• Multiple private clinics and specialists\n\nWhat specific medical service do you need in Port Louis?";
  }
  
  if (input.includes('curepipe') || input.includes('floreal')) {
    return "Healthcare in Curepipe area: 🏞️\n\nKey facilities:\n• Clinique Darné (601 2300)\n• Curepipe Family Clinic (675 3322)\n• Curepipe Dental Clinic\n• Wellkin Hospital nearby\n\nSearch our directory for specific services in this region!";
  }
  
  if (input.includes('moka') || input.includes('ebene')) {
    return "Healthcare in Moka/Ebene: 🏢\n\nMajor providers:\n• Apollo Bramwell Hospital (605 1000)\n• Wellkin Hospital (605 5500)\n• Urgences Médicales de l'Océan Indien (213 3333)\n• Multiple private clinics\n\nThese are among the best medical facilities in Mauritius!";
  }
  
  // General health issues
  if (input.includes('flu') || input.includes('fever') || input.includes('cold')) {
    return "For flu-like symptoms: 🤒\n\nI recommend:\n• Visiting any general practitioner or family clinic\n• Resting and staying hydrated\n• Using our virtual consultation for remote advice\n• If symptoms are severe, visit an emergency department\n\nYou can search for 'general practitioner' on our Find Care page!";
  }
  
  if (input.includes('appointment') || input.includes('book') || input.includes('schedule')) {
    return "To book appointments: 📅\n\nYou can:\n• Click 'Book Appointment' on any facility card\n• Call the facility directly using their phone number\n• Use our virtual consultation form for remote appointments\n• Contact clinics during business hours\n\nI can help you find the right provider first!";
  }
  
  // Search-related
  if (input.includes('search') || input.includes('find') || input.includes('look for')) {
    return "I can help you search for healthcare providers! 🔍\n\nTry:\n• Using the search bar on our Find Care page\n• Searching by medical specialty\n• Searching by location (e.g., 'Port Louis')\n• Or tell me what you're looking for and I'll help!";
  }
  
  // Default intelligent response
  return `I understand you're looking for healthcare assistance in Mauritius! 🇲🇺\n\nAs InteliHealth AI, I specialize in helping people find:\n• Doctors and specialists\n• Hospitals and clinics\n• Emergency services\n• Dental, eye, and cardiac care\n• Location-specific medical services\n\nYou can ask me about:\n• "Find a dentist in Port Louis"\n• "Emergency hospitals near me"\n• "Heart specialists in Mauritius"\n• Or any other healthcare need!\n\nHow can I specifically help you with healthcare today?`;
}
