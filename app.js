/* ─ Pet data ─ */
const PETS = [
  {
    id: 'buddy', name: 'Buddy', breed: 'Golden Retriever', type: 'dog', size: 'large',
    age: '2 years', weight: '28 kg', gender: 'Male', img: 'assets/buddy.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Friendly', 'Active', 'Good with kids', 'House-trained'],
    tempTags: ['Gentle', 'Playful', 'Loyal'],
    desc: 'A gentle and loving companion who enjoys outdoor walks and cuddles. Great with kids and other pets. Buddy is housebroken and responds well to basic commands. He loves playing fetch and swimming.',
    urgent: false,
    energy: 'medium', apartment_friendly: false,
    good_with_kids: true, shedding: 'high', alone_tolerance: 'medium'
  },
  {
    id: 'luna', name: 'Luna', breed: 'Tabby Cat', type: 'cat', size: 'small',
    age: '1 year', weight: '3.2 kg', gender: 'Female', img: 'assets/luna.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Calm', 'Indoor', 'Good with adults'],
    tempTags: ['Curious', 'Independent', 'Affectionate'],
    desc: 'Luna is a curious and playful tabby who loves sunny window spots and interactive toys. She is gentle, quiet and low-maintenance — perfect for apartment living.',
    urgent: false,
    energy: 'low', apartment_friendly: true,
    good_with_kids: false, shedding: 'low', alone_tolerance: 'high'
  },
  {
    id: 'max', name: 'Max', breed: 'Black Labrador', type: 'dog', size: 'large',
    age: '3 years', weight: '32 kg', gender: 'Male', img: 'assets/max.jpg',
    status: 'Urgent', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Energetic', 'Loyal', 'Needs space'],
    tempTags: ['Brave', 'Playful', 'Protective'],
    desc: 'Max is a healthy, energetic Labrador who needs an active family with a yard. He is fully trained and loves to swim. Currently in urgent need of a home.',
    urgent: true,
    energy: 'high', apartment_friendly: false,
    good_with_kids: true, shedding: 'medium', alone_tolerance: 'low'
  },
  {
    id: 'bella', name: 'Bella', breed: 'Persian Cat', type: 'cat', size: 'small',
    age: '4 years', weight: '4 kg', gender: 'Female', img: 'assets/bella.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Calm', 'Fluffy', 'Indoor'],
    tempTags: ['Regal', 'Gentle', 'Quiet'],
    desc: 'Bella is a gorgeous white Persian with piercing blue eyes. She loves quiet homes and will reward you with head-bumps and purrs. Requires regular grooming.',
    urgent: false,
    energy: 'low', apartment_friendly: true,
    good_with_kids: false, shedding: 'medium', alone_tolerance: 'high'
  },
  {
    id: 'charlie', name: 'Charlie', breed: 'Beagle', type: 'dog', size: 'medium',
    age: '1.5 years', weight: '12 kg', gender: 'Male', img: 'assets/charlie.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'No',
    tags: ['Scent hound', 'Playful', 'Family pet'],
    tempTags: ['Sociable', 'Happy-go-lucky', 'Inquisitive'],
    desc: 'Charlie is a joyful Beagle with a wonderful personality. He gets along with everyone — kids, dogs and cats. He thrives with regular walks and playtime.',
    urgent: false,
    energy: 'medium', apartment_friendly: true,
    good_with_kids: true, shedding: 'low', alone_tolerance: 'medium'
  },
  {
    id: 'daisy', name: 'Daisy', breed: 'Pembroke Welsh Corgi', type: 'dog', size: 'small',
    age: '1 year', weight: '10 kg', gender: 'Female', img: 'assets/daisy.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Friendly', 'Low-set', 'Outgoing'],
    tempTags: ['Spirited', 'Alert', 'Affectionate'],
    desc: 'Daisy is a spiritful Corgi who loves attention and short walks. She is very affectionate and gets along well with children. Perfect for a loving family home.',
    urgent: false,
    energy: 'low', apartment_friendly: true,
    good_with_kids: true, shedding: 'medium', alone_tolerance: 'high'
  },
  {
    id: 'milo', name: 'Milo', breed: 'Orange Tabby', type: 'cat', size: 'small',
    age: '2 years', weight: '4.5 kg', gender: 'Male', img: 'assets/milo.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Relaxed', 'Mellow', 'Chatty'],
    tempTags: ['Vibrant', 'Social', 'Sweet'],
    desc: 'Milo is a classic orange tabby with a heart of gold. He loves human company and will follow you around the house for some head scratches.',
    urgent: false,
    energy: 'medium', apartment_friendly: true,
    good_with_kids: false, shedding: 'medium', alone_tolerance: 'high'
  },
  {
    id: 'cooper', name: 'Cooper', breed: 'Border Collie', type: 'dog', size: 'large',
    age: '2.5 years', weight: '20 kg', gender: 'Male', img: 'assets/cooper.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Intelligent', 'Athletic', 'Focused'],
    tempTags: ['Workaholic', 'Eager', 'Protective'],
    desc: 'Cooper is a highly intelligent Border Collie who needs a job to do. Ideal for an active owner who loves training and outdoor activities.',
    urgent: false,
    energy: 'high', apartment_friendly: false,
    good_with_kids: true, shedding: 'high', alone_tolerance: 'low'
  },
  {
    id: 'coco', name: 'Coco', breed: 'Siamese', type: 'cat', size: 'small',
    age: '3 years', weight: '3.5 kg', gender: 'Female', img: 'assets/coco.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Elegant', 'Vocal', 'Attached'],
    tempTags: ['Smart', 'Demanding', 'Loyal'],
    desc: 'Coco is a beautiful Siamese who loves to be the center of attention. She is very vocal and will let you know when she wants playtime or treats.',
    urgent: false,
    energy: 'low', apartment_friendly: true,
    good_with_kids: false, shedding: 'low', alone_tolerance: 'high'
  },
  {
    id: 'oliver', name: 'Oliver', breed: 'French Bulldog', type: 'dog', size: 'small',
    age: '4 years', weight: '11 kg', gender: 'Male', img: 'assets/oliver.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Low-energy', 'Playful', 'Stubborn'],
    tempTags: ['Comedic', 'Chill', 'Lovable'],
    desc: 'Oliver is a typical Frenchie who loves napping as much as he loves short play sessions. He is great with kids and very low maintenance.',
    urgent: false,
    energy: 'low', apartment_friendly: true,
    good_with_kids: true, shedding: 'low', alone_tolerance: 'medium'
  },
  {
    id: 'simba', name: 'Simba', breed: 'Ginger Maine Coon Mix', type: 'cat', size: 'medium',
    age: '5 years', weight: '6.5 kg', gender: 'Male', img: 'assets/simba.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Floppy', 'Big', 'Gentle giant'],
    tempTags: ['Magnificent', 'Fluffy', 'Kind'],
    desc: 'Simba is a large, fluffy ginger cat who is a true gentle giant. He loves lounging in the sun and is surprisingly active for his size.',
    urgent: false,
    energy: 'high', apartment_friendly: true,
    good_with_kids: true, shedding: 'medium', alone_tolerance: 'medium'
  },
  {
    id: 'bailey', name: 'Bailey', breed: 'Cocker Spaniel', type: 'dog', size: 'medium',
    age: '2 years', weight: '13 kg', gender: 'Female', img: 'assets/bailey.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Gentle', 'Happy', 'Good ears'],
    tempTags: ['Cheerful', 'Gentle', 'Sensitive'],
    desc: 'Bailey is a sweet and happy Cocker Spaniel who loves everyone she meets. She thrives on companionship and gentle walks.',
    urgent: false,
    energy: 'medium', apartment_friendly: true,
    good_with_kids: true, shedding: 'high', alone_tolerance: 'medium'
  },
  {
    id: 'nala', name: 'Nala', breed: 'Calico', type: 'cat', size: 'small',
    age: '1.5 years', weight: '3.8 kg', gender: 'Female', img: 'assets/nala.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Striking', 'Independent', 'Quiet'],
    tempTags: ['Reserved', 'Graceful', 'Observant'],
    desc: 'Nala is a beautiful calico cat who enjoys watching the world from a high bookshelf. She is independent but appreciates a good scratching session.',
    urgent: false,
    energy: 'low', apartment_friendly: true,
    good_with_kids: false, shedding: 'medium', alone_tolerance: 'high'
  },
  {
    id: 'teddy', name: 'Teddy', breed: 'Toy Poodle', type: 'dog', size: 'small',
    age: '3 years', weight: '4.5 kg', gender: 'Male', img: 'assets/teddy.jpg',
    status: 'Urgent', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Hypoallergenic', 'Clever', 'Portable'],
    tempTags: ['Bouncy', 'Bright', 'Charming'],
    desc: 'Teddy is a charming little poodle who is always ready for a walk. He is very clever and learns tricks quickly. Currently in urgent need of rehoming.',
    urgent: true,
    energy: 'medium', apartment_friendly: true,
    good_with_kids: true, shedding: 'low', alone_tolerance: 'high'
  },
  {
    id: 'cleo', name: 'Cleo', breed: 'Abyssinian', type: 'cat', size: 'small',
    age: '2 years', weight: '3 kg', gender: 'Female', img: 'assets/cleo.jpg',
    status: 'Available', vaccinated: 'Yes', neutered: 'Yes',
    tags: ['Sleek', 'Active', 'Inquisitive'],
    tempTags: ['Acrobatic', 'Intelligent', 'Curious'],
    desc: 'Cleo is a sleek and active Abyssinian who loves to climb and explore. She is very intelligent and needs interactive toys to keep her busy.',
    urgent: false,
    energy: 'high', apartment_friendly: true,
    good_with_kids: false, shedding: 'low', alone_tolerance: 'medium'
  }
];

let currentPet = null;
let currentFilter = 'all';
let selectedDate = null;
let visitorCount = 1;
let currentStep = 1;
let heartedPets = new Set();
let userProfile = null; // Stores preferences for ML recommendations
let symptomLogs = [
  {
    date: '2025-03-10',
    type: 'Digestive',
    severity: 'Mild',
    description: 'Minor stomach upset after eating too quickly.',
    medications: 'None',
    urgent: false
  },
  {
    date: '2025-03-05',
    type: 'Behavioral',
    severity: 'Mild',
    description: 'Excessive barking at strangers, but calms down with treats.',
    medications: 'None',
    urgent: false
  }
];

/* ──────────────────────
   SCREEN NAVIGATION
────────────────────── */

// Depth map — higher number = further "forward" in the app.
// Forward nav (going deeper): new screen slides in from RIGHT, old slides out LEFT.
// Backward nav (going back):  new screen slides in from LEFT,  old slides out RIGHT.
const SCREEN_DEPTH = {
  'screen-home': 0,
  'screen-ai-match': 1,
  'screen-browse': 1,
  'screen-pet-detail': 2,
  'screen-book-visit': 3,
  'screen-apply': 3,
  'screen-journey': 4,
  'screen-interview': 5,
  'screen-home-check': 5,
  'screen-approval': 6,
  'screen-post-adoption': 7,
  'screen-schedule-vet': 7,
  'screen-log-symptoms': 7,
  'screen-add-symptom-log': 8,
  'screen-contact-support': 7,
  'screen-my-adopted-pets': 9,
  'screen-profile': 10,
};

function goScreen(id) {
  const prev = document.querySelector('.screen.active');
  const next = document.getElementById(id);
  if (!next || prev === next) return;

  const prevDepth = SCREEN_DEPTH[prev ? prev.id : null] ?? 0;
  const nextDepth = SCREEN_DEPTH[id] ?? 0;
  const isBackward = nextDepth < prevDepth;

  // ── Step 1: Position incoming screen at its START point, with no transition ──
  next.style.transition = 'none';
  next.style.opacity = '0';
  next.style.transform = isBackward ? 'translateX(-40px)' : 'translateX(40px)';

  // ── Step 2: Force browser to commit the above style (triggers layout) ──
  void next.offsetWidth;

  // ── Step 3: Re-enable transitions, clear inline overrides, make it active ──
  //    Browser sees ONE combined style delta from the committed start → translateX(0)
  next.style.transition = '';
  next.style.opacity = '';
  next.style.transform = '';
  next.classList.add('active');

  // ── Step 4: Animate outgoing screen in the opposite direction ──
  if (prev) {
    prev.classList.remove('active');
    const exitClass = isBackward ? 'slide-out-right' : 'slide-out-left';
    prev.classList.add(exitClass);
    setTimeout(() => prev.classList.remove(exitClass), 400);
  }

  // Scroll inner areas back to top
  next.scrollTo({ top: 0 });
  const scrollArea = next.querySelector('.browse-scroll-area, .screen-body');
  if (scrollArea) scrollArea.scrollTo({ top: 0 });

  updateNav(id);

  // Screen-specific initialization
  if (id === 'screen-my-adopted-pets') {
    renderAdoptedPets();
  }
  if (id === 'screen-log-symptoms') {
    renderSymptomLogs();
  }
}


function updateNav(screenId) {
  const navMap = {
    'screen-home': 0,
    'screen-browse': 1,
    'screen-journey': 2,
    'screen-profile': 3
  };
  const idx = navMap[screenId];
  document.querySelectorAll('.bottom-nav').forEach(nav => {
    nav.querySelectorAll('.nav-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });
  });
}

/* ──────────────────────
   BROWSE & FILTER
────────────────────── */
function renderPetGrid(filter = 'all') {
  const grid = document.getElementById('pet-grid');
  const filtered = filter === 'all' ? PETS : PETS.filter(p => {
    if (filter === 'dog') return p.type === 'dog';
    if (filter === 'cat') return p.type === 'cat';
    if (filter === 'small') return p.size === 'small' || p.type === 'cat';
    return true;
  });

  grid.innerHTML = filtered.map(p => `
    <div class="pet-grid-card" onclick="viewPet('${p.id}')">
      <div style="position:relative">
        <img src="${p.img}" alt="${p.name}" class="pgc-img" />
        <button class="heart-btn ${heartedPets.has(p.id) ? 'liked' : ''}" 
          onclick="event.stopPropagation();toggleHeart('${p.id}')" 
          id="heart-${p.id}-grid">
          ${heartedPets.has(p.id) ? '♥' : '♡'}
        </button>
        <div class="pet-badge ${p.urgent ? 'urgent' : ''}">${p.status}</div>
      </div>
      <div class="pgc-info">
        <div class="pgc-name">${p.name}</div>
        <div class="pgc-meta">${p.type === 'dog' ? '🐶' : '🐱'} ${p.breed} · ${p.age}</div>
        <div class="pgc-badge-row">
          ${p.tags.slice(0, 2).map(t => `<span class="pgc-badge">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function setFilter(btn, filter) {
  currentFilter = filter;
  document.querySelectorAll('.browse-filters .chip').forEach(c => c.classList.remove('chip-active'));
  btn.classList.add('chip-active');
  renderPetGrid(filter);
}

function filterAndBrowse(filter) {
  currentFilter = filter;
  // Update chip on browse screen
  document.querySelectorAll('.browse-filters .chip').forEach(c => {
    c.classList.toggle('chip-active', c.dataset.filter === filter);
  });
  renderPetGrid(filter);
  goScreen('screen-browse');
}

/* ──────────────────────
   PET DETAIL
────────────────────── */
function viewPet(petId) {
  const pet = PETS.find(p => p.id === petId);
  if (!pet) return;
  currentPet = petId;

  document.getElementById('detail-img').src = pet.img;
  document.getElementById('detail-img').alt = pet.name;
  document.getElementById('gallery-img-main').src = pet.img;
  document.getElementById('detail-name').textContent = pet.name;
  document.getElementById('detail-sub').textContent = `${pet.breed} · ${pet.gender} · ${pet.age}`;
  document.getElementById('detail-status').textContent = pet.status;
  document.getElementById('detail-status').style.background = pet.urgent ? '#fde8e8' : '';
  document.getElementById('detail-status').style.color = pet.urgent ? '#E74C3C' : '';
  document.getElementById('qs-age').textContent = pet.age;
  document.getElementById('qs-weight').textContent = pet.weight;
  document.getElementById('qs-vaccinated').textContent = pet.vaccinated;
  document.getElementById('qs-neutered').textContent = pet.neutered;
  document.getElementById('detail-desc').textContent = pet.desc;
  document.getElementById('mr-neuter').textContent = pet.neutered === 'Yes' ? 'Neutered/Spayed — Jan 2024' : 'Not yet neutered';

  // Tags
  document.getElementById('detail-tags').innerHTML = pet.tags.map(t => `<span class="detail-tag">${t}</span>`).join('');
  document.getElementById('detail-tags-temp').innerHTML = pet.tempTags.map(t => `<span class="detail-tag">${t}</span>`).join('');

  // Heart state
  const heartBtn = document.getElementById('detail-heart');
  heartBtn.textContent = heartedPets.has(petId) ? '♥' : '♡';
  heartBtn.classList.toggle('liked', heartedPets.has(petId));

  // Reset tabs
  switchTab('about');

  goScreen('screen-pet-detail');
}

function switchTab(tab) {
  ['about', 'medical', 'gallery'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle('hidden', t !== tab);
  });
  document.querySelectorAll('.dtab').forEach((btn, i) => {
    btn.classList.toggle('active', ['about', 'medical', 'gallery'][i] === tab);
  });
}

/* ──────────────────────
   ADOPTED PETS
────────────────────── */
function renderAdoptedPets() {
  const list = document.getElementById('adopted-pets-list');
  // For now, showing Buddy as an adopted pet (sample data)
  // In a real app, this would come from a backend
  const adoptedPetsList = [
    { id: 'buddy', name: 'Buddy', breed: 'Golden Retriever', adoptedDate: 'March 14, 2025', img: 'assets/buddy.jpg' }
  ];

  list.innerHTML = adoptedPetsList.length === 0
    ? '<p style="text-align:center;color:var(--c-text-3);padding:20px;">No adopted pets yet. Start your adoption journey today!</p>'
    : adoptedPetsList.map(pet => `
    <div class="adopted-pet-card" onclick="viewAdoptedPet('${pet.id}')">
      <img src="${pet.img}" alt="${pet.name}" class="apc-img" />
      <div class="apc-content">
        <div class="apc-name">${pet.name}</div>
        <div class="apc-details">${pet.breed} · Adopted ${pet.adoptedDate}</div>
      </div>
      <div class="apc-badge">✓ Adopted</div>
    </div>
  `).join('');
}

function viewAdoptedPet(petId) {
  // Navigate to the post-adoption welcome screen
  goScreen('screen-post-adoption');
}

/* ──────────────────────
   SYMPTOM LOGS
────────────────────── */
function renderSymptomLogs() {
  const historyContainer = document.getElementById('symptom-log-history');
  if (!historyContainer) return;

  if (symptomLogs.length === 0) {
    historyContainer.innerHTML = '<div class="symptom-log-empty">No symptom logs yet. Start tracking your pet\'s health!</div>';
    return;
  }

  // Sort logs by date (newest first)
  const sortedLogs = [...symptomLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  historyContainer.innerHTML = sortedLogs.map((log, idx) => {
    const dateObj = new Date(log.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return `
      <div class="symptom-log-item ${log.urgent ? 'urgent' : ''}">
        <div class="sly-date">${dateStr}</div>
        <div class="sly-header">
          <span class="sly-type">${log.type}</span>
          <span class="sly-severity ${log.severity.toLowerCase()}">${log.severity}</span>
        </div>
        <div class="sly-description">${log.description}</div>
        <div class="sly-meta">
          ${log.medications ? `<span class="sly-meta-item">💊 ${log.medications}</span>` : ''}
          ${log.urgent ? `<span class="sly-meta-item" style="color: var(--c-error);">🚨 Urgent</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function saveSymptomLogAndReturn() {
  const dateInput = document.getElementById('symptom-date');
  const typeBtn = document.querySelector('#symptom-type-group .option-btn.selected');
  const severityBtn = document.querySelector('#symptom-severity-group .option-btn.selected');
  const description = document.getElementById('symptom-description').value;
  const medications = document.getElementById('symptom-medications').value;
  const urgent = document.getElementById('chk-urgent').checked;

  // Validate
  if (!dateInput.value || !typeBtn || !severityBtn || !description.trim()) {
    showToast('Please fill in all required fields');
    return;
  }

  // Create new log entry
  const newLog = {
    date: dateInput.value,
    type: typeBtn.textContent,
    severity: severityBtn.textContent,
    description: description,
    medications: medications || 'None',
    urgent: urgent
  };

  // Add to logs
  symptomLogs.push(newLog);

  // Clear form
  dateInput.value = '';
  document.getElementById('symptom-description').value = '';
  document.getElementById('symptom-medications').value = '';
  document.getElementById('chk-urgent').checked = false;

  // Deselect options
  document.querySelectorAll('#symptom-type-group .option-btn, #symptom-severity-group .option-btn').forEach(btn => {
    btn.classList.remove('selected');
  });

  // Re-render logs
  renderSymptomLogs();

  // Show success
  showToast('✓ Symptom log saved!');

  // Navigate back to log symptoms screen
  goScreen('screen-log-symptoms');
}

/* ──────────────────────
   HEARTS / WISHLIST
────────────────────── */
function toggleHeart(petId) {
  if (heartedPets.has(petId)) {
    heartedPets.delete(petId);
  } else {
    heartedPets.add(petId);
  }

  // Update home cards
  const homeHeart = document.getElementById(`heart-${petId}`);
  if (homeHeart) {
    homeHeart.textContent = heartedPets.has(petId) ? '♥' : '♡';
    homeHeart.classList.toggle('liked', heartedPets.has(petId));
  }
  // Update grid cards
  const gridHeart = document.getElementById(`heart-${petId}-grid`);
  if (gridHeart) {
    gridHeart.textContent = heartedPets.has(petId) ? '♥' : '♡';
    gridHeart.classList.toggle('liked', heartedPets.has(petId));
  }
  // Update detail
  const detailHeart = document.getElementById('detail-heart');
  if (detailHeart && currentPet === petId) {
    detailHeart.textContent = heartedPets.has(petId) ? '♥' : '♡';
    detailHeart.classList.toggle('liked', heartedPets.has(petId));
  }

  showToast(heartedPets.has(petId) ? `${petId.charAt(0).toUpperCase() + petId.slice(1)} saved to wishlist ❤️` : 'Removed from wishlist');

  // Persist hearted pets
  localStorage.setItem('pawpath_hearts', JSON.stringify(Array.from(heartedPets)));

  // Update ML recommendations based on new heart state
  updateRecommendations();
}

/* ──────────────────────
   CALENDAR
────────────────────── */
function renderCalendar(containerId, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  function draw() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let html = `
      <div class="cal-header">
        <button class="cal-nav" onclick="calPrev('${containerId}')">‹</button>
        <div class="cal-month">${monthNames[month]} ${year}</div>
        <button class="cal-nav" onclick="calNext('${containerId}')">›</button>
      </div>
      <div class="cal-days-header">${days.map(d => `<div class="cal-day-name">${d}</div>`).join('')}</div>
      <div class="cal-days">
    `;

    for (let i = 0; i < firstDay; i++) html += `<div class="cal-day cal-empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPast = date < new Date(today.setHours(0, 0, 0, 0));
      const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
      const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      let cls = 'cal-day';
      if (isPast) cls += ' cal-disabled';
      if (isToday) cls += ' cal-today';
      if (isSelected) cls += ' cal-selected';
      html += `<div class="${cls}" onclick="selectDate(${year},${month},${d},'${containerId}')">${d}</div>`;
    }

    html += '</div>';
    container.innerHTML = html;
  }

  container._draw = draw;
  container._getYM = () => ({ year, month });
  container._setYM = (y, m) => { year = y; month = m; draw(); };
  draw();
}

window.calPrev = function (id) {
  const c = document.getElementById(id);
  const { year, month } = c._getYM();
  const nm = month === 0 ? 11 : month - 1;
  const ny = month === 0 ? year - 1 : year;
  c._setYM(ny, nm);
};
window.calNext = function (id) {
  const c = document.getElementById(id);
  const { year, month } = c._getYM();
  const nm = month === 11 ? 0 : month + 1;
  const ny = month === 11 ? year + 1 : year;
  c._setYM(ny, nm);
};
window.selectDate = function (y, m, d, id) {
  selectedDate = new Date(y, m, d);
  // Redraw all calendars
  ['calendar-mini', 'calendar-interview', 'calendar-homecheck', 'calendar-vet'].forEach(cid => {
    const c = document.getElementById(cid);
    if (c && c._draw) c._draw();
  });
};

/* ──────────────────────
   TIME SLOT
────────────────────── */
let selectedSlot = null;
function selectSlot(btn) {
  const parent = btn.closest('.time-slots');
  parent.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSlot = btn.textContent;
}

/* ──────────────────────
   VISITOR STEPPER
────────────────────── */
function changeVisitors(delta) {
  visitorCount = Math.max(1, Math.min(6, visitorCount + delta));
  document.getElementById('visitor-count').textContent = visitorCount;
}

/* ──────────────────────
   MULTI-STEP FORM
────────────────────── */
function nextStep(step) {
  document.getElementById(`form-step-${step}`).classList.add('hidden');
  document.getElementById(`form-step-${step + 1}`).classList.remove('hidden');

  // Update progress indicator
  document.getElementById(`fp${step}`).classList.remove('fp-active');
  document.getElementById(`fp${step}`).classList.add('fp-done');
  document.getElementById(`fp${step + 1}`).classList.add('fp-active');
  currentStep = step + 1;
}

function prevStep(step) {
  document.getElementById(`form-step-${step}`).classList.add('hidden');
  document.getElementById(`form-step-${step - 1}`).classList.remove('hidden');

  document.getElementById(`fp${step}`).classList.remove('fp-active');
  document.getElementById(`fp${step - 1}`).classList.remove('fp-done');
  document.getElementById(`fp${step - 1}`).classList.add('fp-active');
  currentStep = step - 1;
}

function selectOption(btn, groupId) {
  document.getElementById(groupId).querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

/* ──────────────────────
   DOCUMENT UPLOAD SIMULATION
────────────────────── */
function simulateUpload(doc) {
  const sub = document.getElementById(`uc-${doc}-sub`);
  const status = document.getElementById(`uc-${doc}-status`);
  const icon = document.getElementById(`uc-${doc}-icon`);
  sub.textContent = 'Uploading…';
  status.textContent = '⏳';
  setTimeout(() => {
    sub.textContent = 'Uploaded successfully';
    status.textContent = '✅';
    icon.textContent = doc === 'nric' ? '🪪' : doc === 'proof' ? '✅' : '✅';
  }, 1200);
}

/* ──────────────────────
   CONFIRMATIONS
────────────────────── */
function confirmVisit() {
  const petName = currentPet ? currentPet.charAt(0).toUpperCase() + currentPet.slice(1) : 'your pet';
  const dateStr = selectedDate ? selectedDate.toDateString() : 'your chosen date';
  const slot = selectedSlot || 'your chosen time';
  showModal('📅', 'Visit Confirmed!', `Your gallery visit to meet ${petName} is confirmed for ${dateStr} at ${slot}. A confirmation has been sent to your email.`);
}

function confirmInterview() {
  const dateStr = selectedDate ? selectedDate.toDateString() : 'your chosen date';
  const slot = selectedSlot || 'your chosen time';
  showModal('🎥', 'Interview Scheduled!', `Your virtual interview is set for ${dateStr} at ${slot}. You'll receive a link via email 1 hour before the call.`);
}

function confirmHomeCheck() {
  const dateStr = selectedDate ? selectedDate.toDateString() : 'your chosen date';
  const slot = selectedSlot || 'your chosen time';
  showModal('🏡', 'Home Visit Booked!', `Our officer will visit your home on ${dateStr} at ${slot}. You will receive an SMS reminder 24 hrs before.`);
}

function submitApplication() {
  showModal('📋', 'Application Submitted!', 'Your adoption application has been received. Our team will review it within 2–3 business days. Track your progress in My Journey.');
}

function processPayment() {
  showModal('🎉', 'Payment Successful!', 'Your adoption fee of S$205.00 has been processed. Download your adoption agreement and prepare to welcome Buddy home!');
  setTimeout(() => {
    closeModal();
    goScreen('screen-post-adoption');
  }, 2800);
}

function submitReview() {
  showModal('⭐', 'Thank You!', 'Your feedback helps us improve the adoption experience for future adopters. Welcome to the SPCA family!');
}

/* ──────────────────────
   MODAL & TOAST
────────────────────── */
function showModal(icon, title, body) {
  document.getElementById('modal-icon').textContent = icon;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

/* ──────────────────────
   PAYMENT OPTIONS
────────────────────── */
function selectPay(el) {
  document.querySelectorAll('.pay-opt').forEach(p => p.classList.remove('pay-opt-active'));
  el.classList.add('pay-opt-active');
  const type = el.querySelector('span').textContent;
  const cardForm = document.getElementById('card-form');
  cardForm.style.display = type === 'Card' ? 'block' : 'none';
}

/* ──────────────────────
   STARS RATING
────────────────────── */
function rateStar(n) {
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`s${i}`).classList.toggle('active', i <= n);
  }
}

/* ──────────────────────
   MISC
────────────────────── */
function downloadDoc(type) {
  showToast(type === 'agreement' ? '📜 Adoption Agreement downloaded!' : '🏆 Certificate downloaded!');
}
function openResource(type) {
  const labels = { feeding: '🍖 Feeding Guide opening…', training: '🎾 Training Tips opening…', vet: '🩺 Vet Finder opening…' };
  showToast(labels[type] || 'Opening…');
}

function sign_out() {
  localStorage.removeItem('pawpath_profile');
  localStorage.removeItem('pawpath_hearts');
  userProfile = null;
  heartedPets = new Set();
  renderPetGrid('all');
  updateRecommendations();
  showToast('Signed out! Session cleared.');
  goScreen('screen-home');
}

/* ──────────────────────
   INIT
────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderPetGrid('all');
  renderCalendar('calendar-mini');
  renderCalendar('calendar-interview');
  renderCalendar('calendar-homecheck');
  renderCalendar('calendar-vet');

  // Ensure home screen is active
  document.getElementById('screen-home').classList.add('active');

  // Load saved profile
  const savedProfile = localStorage.getItem('pawpath_profile');
  if (savedProfile) {
    try {
      userProfile = JSON.parse(savedProfile);
    } catch (e) { }
  }

  // Load saved hearts
  const savedHearts = localStorage.getItem('pawpath_hearts');
  if (savedHearts) {
    try {
      const heartList = JSON.parse(savedHearts);
      heartedPets = new Set(heartList);
      // Re-render grid to show active hearts
      renderPetGrid(currentFilter);
    } catch (e) { }
  }

  // Initial recommendation run
  if (userProfile || heartedPets.size > 0) {
    updateRecommendations();
  }
});

/* ──────────────────────
   ML RECOMMENDATIONS
────────────────────── */

function updateRecommendations() {
  const container = document.getElementById('home-ml-recommendations');
  const list = document.getElementById('ml-recommendations-list');

  if (!window.PawML) {
    container.classList.add('hidden');
    return;
  }

  // Derive the active profile to use for ranking
  // If user hasn't run the AI Match yet, use their "Likes" to build a profile
  // If they have both, we blend them.
  const profileToUse = deriveEffectiveProfile();

  if (!profileToUse) {
    container.classList.add('hidden');
    return;
  }

  // Use the ML model to rank all pets
  const ranked = PawML.rankPets(profileToUse, PETS);

  // Show top 3
  const topMatches = ranked.slice(0, 3);

  list.innerHTML = topMatches.map(p => `
    <div class="pet-card" onclick="viewPet('${p.id}')">
      <div class="pet-card-img-wrap">
        <img src="${p.img}" alt="${p.name}" class="pet-card-img" />
        <button class="heart-btn ${heartedPets.has(p.id) ? 'liked' : ''}" 
                onclick="event.stopPropagation();toggleHeart('${p.id}')">
          ${heartedPets.has(p.id) ? '♥' : '♡'}
        </button>
        <div class="pet-badge">${Math.round(p.mlScore * 100)}% Match</div>
      </div>
      <div class="pet-card-info">
        <div class="pet-card-name">${p.name}</div>
        <div class="pet-card-meta">${p.type === 'dog' ? '🐶' : '🐱'} ${p.breed}</div>
      </div>
    </div>
  `).join('');

  container.classList.remove('hidden');
}

/**
 * Combines AI-extracted preferences with manual "Likes" 
 * to create the best numeric profile for the ML model.
 */
function deriveEffectiveProfile() {
  let finalProfile = userProfile ? { ...userProfile } : null;

  // If we have likes, refine the profile based on them
  if (heartedPets.size > 0) {
    const likedPets = Array.from(heartedPets).map(id => PETS.find(p => p.id === id)).filter(Boolean);

    // Simple average of categorical and numeric traits
    const avgTraits = {
      wants_dog: likedPets.filter(p => p.type === 'dog').length / likedPets.length,
      preferred_size: 0,
      preferred_energy: 0,
      apartment_friendly: likedPets.filter(p => p.apartment_friendly).length / likedPets.length,
      has_kids: likedPets.filter(p => p.good_with_kids).length / likedPets.length,
      max_shedding: 0,
      alone_tolerance_needed: 0
    };

    const SIZE_VALS = { small: 0, medium: 0.5, large: 1 };
    const ENERGY_VALS = { low: 0, medium: 0.5, high: 1 };
    const SHED_VALS = { low: 0, medium: 0.5, high: 1 };

    likedPets.forEach(p => {
      avgTraits.preferred_size += SIZE_VALS[p.size] ?? 0.5;
      avgTraits.preferred_energy += ENERGY_VALS[p.energy] ?? 0.5;
      avgTraits.max_shedding += SHED_VALS[p.shedding] ?? 0.5;
      avgTraits.alone_tolerance_needed += SHED_VALS[p.alone_tolerance] ?? 0.5;
    });

    avgTraits.preferred_size /= likedPets.length;
    avgTraits.preferred_energy /= likedPets.length;
    avgTraits.max_shedding /= likedPets.length;
    avgTraits.alone_tolerance_needed /= likedPets.length;

    // Convert numeric averages back to profile format if starting fresh
    if (!finalProfile) {
      finalProfile = {
        wants_dog: avgTraits.wants_dog > 0.5,
        preferred_size: avgTraits.preferred_size < 0.33 ? 'small' : avgTraits.preferred_size > 0.66 ? 'large' : 'medium',
        preferred_energy: avgTraits.preferred_energy < 0.33 ? 'low' : avgTraits.preferred_energy > 0.66 ? 'high' : 'medium',
        apartment_friendly: avgTraits.apartment_friendly > 0.5,
        has_kids: avgTraits.has_kids > 0.5,
        max_shedding: avgTraits.max_shedding < 0.33 ? 'low' : avgTraits.max_shedding > 0.66 ? 'high' : 'medium',
        alone_tolerance_needed: avgTraits.alone_tolerance_needed < 0.33 ? 'low' : avgTraits.alone_tolerance_needed > 0.66 ? 'high' : 'medium'
      };
    } else {
      // If we already have an AI profile, nudge it significantly towards the user's manual likes
      // (This is a 30/70 blend - 70% weight to manual likes)
      finalProfile.wants_dog = (finalProfile.wants_dog ? 1 : 0) * 0.3 + avgTraits.wants_dog * 0.7 > 0.5;
      finalProfile.apartment_friendly = (finalProfile.apartment_friendly ? 1 : 0) * 0.3 + avgTraits.apartment_friendly * 0.7 > 0.5;
      finalProfile.has_kids = (finalProfile.has_kids ? 1 : 0) * 0.3 + avgTraits.has_kids * 0.7 > 0.5;

      // Also adjust categorical traits based on averages
      if (avgTraits.preferred_size < 0.33) finalProfile.preferred_size = 'small';
      else if (avgTraits.preferred_size > 0.66) finalProfile.preferred_size = 'large';

      if (avgTraits.preferred_energy < 0.33) finalProfile.preferred_energy = 'low';
      else if (avgTraits.preferred_energy > 0.66) finalProfile.preferred_energy = 'high';
    }
  }

  return finalProfile;
}

/* ──────────────────────
   AI MATCH FEATURE
────────────────────── */

function useExample(text) {
  const input = document.getElementById('aim-input');
  if (input) {
    input.value = text;
    input.focus();
  }
}

function resetAIMatch() {
  // Show prompt section, hide loading/error/results
  document.getElementById('aim-prompt-section').style.display = '';
  document.getElementById('aim-loading').classList.add('hidden');
  document.getElementById('aim-error').classList.add('hidden');
  document.getElementById('aim-results').classList.add('hidden');
  document.getElementById('aim-results-list').innerHTML = '';
  document.getElementById('aim-btn').disabled = false;
}

async function runAIMatch() {
  const input = document.getElementById('aim-input');
  const prompt = input ? input.value.trim() : '';
  if (!prompt) {
    showToast('Please describe your ideal pet first 🐾');
    input && input.focus();
    return;
  }

  // Show loading, hide others
  document.getElementById('aim-prompt-section').style.display = 'none';
  document.getElementById('aim-loading').classList.remove('hidden');
  document.getElementById('aim-error').classList.add('hidden');
  document.getElementById('aim-results').classList.add('hidden');
  document.getElementById('aim-btn').disabled = true;

  // Update loading sub-text progressively
  const subEl = document.getElementById('aim-loading-sub');
  const steps = ['Extracting preferences…', 'Filtering pets…', 'Scoring compatibility…', 'Ranking matches…'];
  let stepIdx = 0;
  const stepTimer = setInterval(() => {
    stepIdx = (stepIdx + 1) % steps.length;
    if (subEl) subEl.textContent = steps[stepIdx];
  }, 1800);

  try {
    const response = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    clearInterval(stepTimer);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server error (${response.status})`);
    }

    const data = await response.json();
    const results = data.results || [];

    document.getElementById('aim-loading').classList.add('hidden');

    if (results.length === 0) {
      showAIError('No matches found. Try describing your lifestyle differently!');
      return;
    }

    renderMatchResults(results);

    // ── ML INTEGRATION ─────────────────────────────────────────
    // Save preferences to profile and update home recommendations
    if (data.preferences) {
      userProfile = {
        wants_dog: data.preferences.species === 'dog',
        preferred_size: data.preferences.size || 'medium',
        preferred_energy: data.preferences.energy || 'medium',
        apartment_friendly: data.preferences.apartment_friendly || false,
        has_kids: data.preferences.good_with_kids || false,
        max_shedding: data.preferences.shedding || 'medium',
        alone_tolerance_needed: data.preferences.alone_tolerance || 'medium'
      };

      // Persist to localStorage
      localStorage.setItem('pawpath_profile', JSON.stringify(userProfile));

      // Update the ML section on home screen
      updateRecommendations();
    }

  } catch (err) {
    clearInterval(stepTimer);
    document.getElementById('aim-loading').classList.add('hidden');
    showAIError(err.message || 'Something went wrong. Please try again.');
  }
}

function showAIError(msg) {
  document.getElementById('aim-prompt-section').style.display = '';
  document.getElementById('aim-error-msg').textContent = msg;
  document.getElementById('aim-error').classList.remove('hidden');
  document.getElementById('aim-btn').disabled = false;
}

function renderMatchResults(results) {
  const list = document.getElementById('aim-results-list');
  list.innerHTML = results.map((r, i) => {
    const score = r.compatibility_score;
    const scoreClass = score >= 80 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low';
    const medal = i === 0 ? ' aim-rank-1' : '';
    const pet = PETS.find(p => p.id === r.id) || {};
    return `
    <div class="aim-result-card${medal}" onclick="viewPet('${r.id}')">
      <img class="aim-result-img" src="${r.img}" alt="${r.name}" />
      <div class="aim-result-body">
        <div class="aim-result-name">${i === 0 ? '🥇 ' : ''}${r.name}</div>
        <div class="aim-result-breed">${pet.breed || ''} · ${r.age}</div>
        <div class="aim-score-row ${scoreClass}">
          <div class="aim-score-bar-track">
            <div class="aim-score-bar-fill" style="width:${score}%"></div>
          </div>
          <div class="aim-score-badge">${score}%</div>
        </div>
        <div class="aim-result-reason">${r.reason}</div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('aim-results').classList.remove('hidden');

  // Animate score bars after DOM insertion
  setTimeout(() => {
    list.querySelectorAll('.aim-score-bar-fill').forEach((bar, i) => {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = targetWidth; }, 100 + i * 80);
    });
  }, 50);
}
